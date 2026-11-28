#!/usr/bin/env python3
"""
install_memorial_profile.py — Sincroniza o perfil `memorial-atendimento` com a
versão segura do fluxo de áudio do Memorial (Etapa 3).

Contexto
--------
O repo `memorial-homenagens` foi corrigido (commit `06a4ca3`): a credencial do
audio-service saiu do código, a trava de confirmação deixou de ser auto-aprovada
e ganhou modo `--dry-run`. Porém o perfil `memorial-atendimento` vive FORA do Git
(`/home/hermes/.hermes/profiles/memorial-atendimento/`) e ainda contém:

  * a versão pré-fix de `test_audio_flow.py` (sem `--decide`, sem `--dry-run`,
    sem `confirm_or_abort` e com a credencial embutida);
  * `memorial_client.py` com `DEFAULT_API_KEY` hardcoded e fallback silencioso
    para esse default (rota que continua usando a credencial velha mesmo depois
    da rotação no Coolify);
  * cópias/backup com a mesma credencial em disco.

Este script é o **instalador/verificador** dessa sincronização. Ele é fail-closed:
cada passo é verificado depois de aplicado e qualquer divergência vira pendência
com código de saída != 0.

Regras de segurança deste script
--------------------------------
* NUNCA grava o valor de uma credencial em disco por conta própria.
* NUNCA imprime o valor de uma credencial (nem em mensagens de erro).
* NUNCA cria backup de arquivo que contém credencial — backup preservaria o
  segredo em disco, anulando a limpeza. Arquivos com segredo são sanitizados
  in-place e o supressor do backup é reportado.
* NENHUM literal de credencial real fica neste arquivo: a detecção é por
  PADRÃO (atribuição literal de *_API_KEY e tokens longos entre aspas). Se
  quiser apagar um valor específico, passe-o em runtime com `--old-key` — o
  valor não fica no repositório.

Uso (executar por um perfil COM acesso ao path do perfil — ex.: platform/sysops):

  # só diagnostica (não escreve nada)
  python3 scripts/install_memorial_profile.py --check

  # aplica a sincronização
  python3 scripts/install_memorial_profile.py --apply

  # aplica e valida o resultado (recomendado)
  python3 scripts/install_memorial_profile.py --apply --verify

Exit codes:
  0 = tudo certo (ou --check sem pendências)
  1 = pendência encontrada (modo --check) ou falha aplicada (modo --apply)
  2 = erro de uso/ambiente
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import stat
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_FLOW = REPO_ROOT / "scripts" / "test_audio_flow.py"

DEFAULT_PROFILE_PATH = Path("/home/hermes/.hermes/profiles/memorial-atendimento")

# Atribuição literal de credencial: DEFAULT_API_KEY = "..." / 'AUDIO_API_KEY': '...'
SECRET_ASSIGNMENT_RE = re.compile(
    r"""(?P<prefix>(?:[A-Z0-9_]*API_KEY)\s*[:=]\s*)"""
    r"""(?P<quote>["'])(?P<value>[A-Za-z0-9_\-]{20,})(?P=quote)"""
)

# Token longo entre aspas (base64url) — sinal de credencial embutida.
LONG_QUOTED_RE = re.compile(r"""["'](?P<value>[A-Za-z0-9_\-]{32,})["']""")

SKIP_DIR_NAMES = {".git", "node_modules", "__pycache__", ".venv"}
TEXT_SUFFIXES = {
    ".py", ".md", ".txt", ".json", ".yaml", ".yml", ".env", ".sh", ".cfg", ".toml", ".bak",
}

ENV_ONLY_CLIENT_SNIPPET = '''import os

# Credencial do audio-service: SOMENTE do ambiente. Sem default, sem fallback
# silencioso. Se faltar, a chamada externa NÃO é feita (fail-closed).
DEFAULT_API_KEY = os.environ.get("AUDIO_API_KEY", "")

if not DEFAULT_API_KEY:
    raise SystemExit(
        "AUDIO_API_KEY ausente no ambiente do perfil. "
        "Configure a variavel antes de usar o cliente de audio."
    )
'''


class Report:
    def __init__(self) -> None:
        self.ok: list[str] = []
        self.pending: list[str] = []
        self.actions: list[str] = []

    def ok_msg(self, msg: str) -> None:
        self.ok.append(msg)
        print(f"  [OK] {msg}")

    def pending_msg(self, msg: str) -> None:
        self.pending.append(msg)
        print(f"  [PENDENTE] {msg}")

    def action_msg(self, msg: str) -> None:
        self.actions.append(msg)
        print(f"  [ACAO] {msg}")


def iter_text_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIR_NAMES]
        for name in filenames:
            p = Path(dirpath) / name
            if p.suffix.lower() in TEXT_SUFFIXES or name.startswith(".env"):
                yield p


def _has_secret(data: str, old_key: str | None) -> bool:
    if old_key and old_key in data:
        return True
    if SECRET_ASSIGNMENT_RE.search(data):
        return True
    return bool(LONG_QUOTED_RE.search(data))


def find_secret_files(profile_path: Path, old_key: str | None = None) -> list[Path]:
    hits: list[Path] = []
    for p in iter_text_files(profile_path):
        try:
            data = p.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        if _has_secret(data, old_key):
            hits.append(p)
    return hits


def find_client_files(profile_path: Path) -> list[Path]:
    return [p for p in iter_text_files(profile_path) if p.name == "memorial_client.py"]


def find_flow_copies(profile_path: Path) -> list[Path]:
    return [p for p in iter_text_files(profile_path) if p.name == "test_audio_flow.py"]


def flow_is_fixed(path: Path) -> bool:
    try:
        data = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return False
    return (
        "--dry-run" in data
        and "--decide" in data
        and "confirm_or_abort" in data
        and not SECRET_ASSIGNMENT_RE.search(data)
        and not LONG_QUOTED_RE.search(data)
    )


def client_is_env_only(path: Path) -> bool:
    try:
        data = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return False
    has_env_lookup = (
        'os.environ.get("AUDIO_API_KEY"' in data
        or "os.environ.get('AUDIO_API_KEY'" in data
    )
    no_literal = not SECRET_ASSIGNMENT_RE.search(data) and not LONG_QUOTED_RE.search(data)
    return has_env_lookup and no_literal


def env_file(profile_path: Path) -> Path:
    return profile_path / ".env"


def env_has_key(path: Path) -> bool:
    if not path.exists():
        return False
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        if line.startswith("AUDIO_API_KEY="):
            return bool(line.split("=", 1)[1].strip())
    return False


def sanitize(data: str, old_key: str | None) -> tuple[str, int]:
    """Remove literais de credencial de um arquivo texto, preservando o resto."""
    count = 0

    def _sub_assign(m: re.Match) -> str:
        nonlocal count
        count += 1
        prefix = m.group("prefix")
        quote = m.group("quote")
        if "environ" not in prefix:
            return f'{prefix}os.environ.get("AUDIO_API_KEY", "")'
        return f"{prefix}{quote}{quote}"

    new = SECRET_ASSIGNMENT_RE.sub(_sub_assign, data)

    def _sub_long(m: re.Match) -> str:
        nonlocal count
        value = m.group("value")
        if old_key and value == old_key:
            count += 1
            return '""'
        # token longo que não é a chave antiga: preserva, mas sinaliza
        return m.group(0)

    new = LONG_QUOTED_RE.sub(_sub_long, new)

    if old_key and old_key in new:
        count += new.count(old_key)
        new = new.replace(old_key, "")

    return new, count


def apply_mode(profile_path: Path, report: Report, old_key: str | None) -> int:
    if not profile_path.is_dir():
        print(f"Perfil nao encontrado: {profile_path}", file=sys.stderr)
        return 2

    # 1) literais de credencial em disco (fora do .env)
    for p in find_secret_files(profile_path, old_key):
        if p == env_file(profile_path):
            continue
        data = p.read_text(encoding="utf-8", errors="ignore")
        new, n = sanitize(data, old_key)
        if n and new != data:
            p.write_text(new, encoding="utf-8")
            report.action_msg(
                f"literal de credencial removido de {p} "
                "(backup suprimido de proposito: preservaria o segredo em disco)"
            )
        else:
            report.pending_msg(f"literal nao-removivel em {p} (revisar manualmente)")

    # 2) memorial_client.py sem default hardcoded nem fallback silencioso
    for client in find_client_files(profile_path):
        data = client.read_text(encoding="utf-8", errors="ignore")
        new, _ = sanitize(data, old_key)
        changed = False

        if "import os" not in new:
            new = "import os\n" + new
            changed = True

        # fail-closed: sem credencial no ambiente, a chamada externa NÃO é feita.
        if "AUDIO_API_KEY ausente" not in new:
            new += (
                "\n\nif not DEFAULT_API_KEY:\n"
                "    raise SystemExit(\n"
                '        "AUDIO_API_KEY ausente no ambiente do perfil. "\n'
                '        "Configure a variavel antes de usar o cliente de audio."\n'
                "    )\n"
            )
            changed = True

        if changed:
            client.write_text(new, encoding="utf-8")
            report.action_msg(f"cliente convertido para env-only (fail-closed): {client}")
        else:
            report.ok_msg(f"cliente ja sem default hardcoded: {client}")

    # 3) copiar a versao segura do fluxo
    for flow in find_flow_copies(profile_path):
        if flow_is_fixed(flow):
            report.ok_msg(f"fluxo ja na versao segura: {flow}")
            continue
        if not SOURCE_FLOW.is_file():
            report.pending_msg(
                f"fonte {SOURCE_FLOW} ausente; nao foi possivel sincronizar {flow}"
            )
            continue
        shutil.copy2(SOURCE_FLOW, flow)
        report.action_msg(f"fluxo pre-fix substituido pela versao segura: {flow}")

    # 4) .env do perfil: chmod 0600 e presenca da chave NOVA
    env_path = env_file(profile_path)
    if env_path.exists():
        mode = stat.S_IMODE(env_path.stat().st_mode)
        if mode != 0o600:
            os.chmod(env_path, 0o600)
            report.action_msg(f"permissao de {env_path} ajustada para 0600 (era {oct(mode)})")
    if env_has_key(env_path):
        report.ok_msg(f"{env_path} possui AUDIO_API_KEY")
    else:
        report.pending_msg(
            f"{env_path} NAO possui AUDIO_API_KEY — grave a credencial NOVA (apos rotacao) "
            "com modo 0600. A credencial antiga nunca deve ser reutilizada."
        )

    return 0


def verify_mode(profile_path: Path, report: Report, old_key: str | None) -> int:
    secret_hits = [
        p for p in find_secret_files(profile_path, old_key) if p != env_file(profile_path)
    ]
    if secret_hits:
        for p in secret_hits:
            report.pending_msg(f"literal de credencial ainda presente em {p}")
    else:
        report.ok_msg("nenhum literal de credencial fora do .env")

    for client in find_client_files(profile_path):
        if client_is_env_only(client):
            report.ok_msg(f"cliente env-only: {client}")
        else:
            report.pending_msg(f"cliente ainda com default hardcoded: {client}")

    for flow in find_flow_copies(profile_path):
        if flow_is_fixed(flow):
            report.ok_msg(f"fluxo na versao segura (--decide/--dry-run/confirm_or_abort): {flow}")
        else:
            report.pending_msg(f"fluxo ainda na versao pre-fix: {flow}")

    env_path = env_file(profile_path)
    if env_has_key(env_path):
        report.ok_msg(".env do perfil possui AUDIO_API_KEY")
    else:
        report.pending_msg(".env do perfil sem AUDIO_API_KEY")

    if env_path.exists():
        mode = stat.S_IMODE(env_path.stat().st_mode)
        if mode != 0o600:
            report.pending_msg(f".env do perfil com permissao {oct(mode)} (esperado 0o600)")

    return 0


def check_mode(profile_path: Path, report: Report, old_key: str | None) -> int:
    if not profile_path.is_dir():
        print(f"Perfil nao encontrado: {profile_path}", file=sys.stderr)
        return 2
    report.action_msg(f"diagnostico apenas (nada escrito) em {profile_path}")

    secret_hits = [
        p for p in find_secret_files(profile_path, old_key) if p != env_file(profile_path)
    ]
    report.pending_msg(f"arquivos com credencial no perfil: {len(secret_hits)}")
    for p in secret_hits:
        print(f"      - {p}")

    for client in find_client_files(profile_path):
        state = "env-only" if client_is_env_only(client) else "DEFAULT HARDCODED"
        report.ok_msg(f"cliente {client}: {state}")

    for flow in find_flow_copies(profile_path):
        state = "versao segura" if flow_is_fixed(flow) else "versao PRE-FIX"
        report.ok_msg(f"fluxo {flow}: {state}")

    report.ok_msg(
        ".env com AUDIO_API_KEY"
        if env_has_key(env_file(profile_path))
        else ".env SEM AUDIO_API_KEY"
    )
    return 1 if secret_hits else 0


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--profile-path",
        default=str(DEFAULT_PROFILE_PATH),
        help="Caminho do perfil memorial-atendimento",
    )
    parser.add_argument("--check", action="store_true", help="So diagnostica (padrao)")
    parser.add_argument("--apply", action="store_true", help="Aplica a sincronizacao")
    parser.add_argument("--verify", action="store_true", help="Aplica e valida")
    parser.add_argument(
        "--old-key",
        default=None,
        help=(
            "Credencial especifica a apagar (passada em runtime; nao fica no repo). "
            "O valor nunca e impresso."
        ),
    )
    args = parser.parse_args(argv)

    profile_path = Path(args.profile_path).expanduser()
    report = Report()

    print("=" * 60)
    print("SINCRONIZACAO DO PERFIL memorial-atendimento (fluxo de audio seguro)")
    print("=" * 60)

    if args.apply:
        rc = apply_mode(profile_path, report, args.old_key)
        if rc != 0:
            return rc
        if args.verify:
            print("\n--- verificacao pos-aplicacao ---")
            verify_mode(profile_path, report, args.old_key)
    else:
        check_mode(profile_path, report, args.old_key)

    print("\n" + "=" * 60)
    print(
        f"resumo: {len(report.ok)} ok, {len(report.pending)} pendente(s), "
        f"{len(report.actions)} acao(oes)"
    )
    if report.pending:
        print("PENDENCIAS:")
        for item in report.pending:
            print(f"  - {item}")
    print("=" * 60)
    return 1 if report.pending else 0


if __name__ == "__main__":
    sys.exit(main())
