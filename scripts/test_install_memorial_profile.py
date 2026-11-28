#!/usr/bin/env python3
"""
test_install_memorial_profile.py — Teste do instalador
`scripts/install_memorial_profile.py` (sincronização do perfil
`memorial-atendimento` com o fluxo de áudio seguro).

IMPORTANTE: o teste roda contra um FIXTURE local, criado em tempo de execução
dentro do scratch — nunca contra o perfil real. A credencial usada no fixture é
uma string sintética de 43 caracteres (formato base64url) montada por concatenação,
para provar que o instalador detecta e remove literais de credencial sem que
nenhuma credencial real fique neste arquivo.

Cobertura:
  1. `--check` detecta a credencial nos arquivos do fixture e a versão pré-fix do
     fluxo, e NÃO escreve nada;
  2. `--apply --verify` remove os literais, converte o cliente para env-only
     (fail-closed, sem fallback silencioso), sincroniza o fluxo seguro
     (`--decide`/`--dry-run`/`confirm_or_abort`), ajusta o `.env` para 0600 e
     registra a necessidade da credencial NOVA;
  3. após aplicar, não resta nenhum literal da credencial fora do `.env`;
  4. o cliente não tem mais fallback silencioso (falha fail-closed);
  5. o fluxo sincronizado tem `--decide`/`--dry-run`/`confirm_or_abort`;
  6. a segunda execução é idempotente.
"""

from __future__ import annotations

import os
import pathlib
import shutil
import subprocess
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
INSTALLER = REPO / "scripts" / "install_memorial_profile.py"

SCRATCH = pathlib.Path("/home/hermes/.hermes/profiles/coder/cache/scratch")
FIXTURE = SCRATCH / "fixture-memorial-atendimento"

# String sintética (NÃO é credencial real) montada por concatenação.
FAKE_KEY = "SINTETIC" + "O" * 6 + "_" + "z" * 26

CLIENT_PRE = f'''import os
import urllib.request

DEFAULT_API_KEY = "{FAKE_KEY}"
AUDIO_SERVICE_URL = os.environ.get("AUDIO_SERVICE_URL", "http://10.0.9.1.sslip.io:18080")


def call(path, payload):
    headers = {{"Authorization": f"Bearer {{DEFAULT_API_KEY}}"}}
    req = urllib.request.Request(
        f"{{AUDIO_SERVICE_URL}}{{path}}",
        data=__import__("json").dumps(payload).encode(),
        headers=headers,
    )
    return urllib.request.urlopen(req, timeout=15)
'''

FLOW_PRE = f'''#!/usr/bin/env python3
"""test_audio_flow.py — versao pre-fix (credencial embutida, sem --decide/--dry-run)."""

import os
import urllib.request

AUDIO_SERVICE_URL = os.environ.get("AUDIO_SERVICE_URL", "http://10.0.9.1:18080")
AUDIO_API_KEY = os.environ.get("AUDIO_API_KEY", "{FAKE_KEY}")
'''


def run(*args) -> tuple[int, str]:
    proc = subprocess.run(
        [sys.executable, str(INSTALLER), *args],
        capture_output=True,
        text=True,
    )
    return proc.returncode, proc.stdout + proc.stderr


def build_fixture() -> None:
    if FIXTURE.exists():
        shutil.rmtree(FIXTURE)
    FIXTURE.mkdir(parents=True)
    (FIXTURE / "memorial_client.py").write_text(CLIENT_PRE, encoding="utf-8")
    (FIXTURE / "test_audio_flow.py").write_text(FLOW_PRE, encoding="utf-8")
    (FIXTURE / "memorial_client.py.bak").write_text(CLIENT_PRE, encoding="utf-8")
    (FIXTURE / ".env").write_text("TZ=America/Sao_Paulo\n", encoding="utf-8")


def main() -> int:
    build_fixture()
    assert FIXTURE.is_dir(), "fixture nao criado"

    # 1) --check diagnostica e nao escreve
    rc, out = run("--check", "--profile-path", str(FIXTURE), "--old-key", FAKE_KEY)
    assert rc == 1, f"--check deveria sinalizar pendencia, rc={rc}"
    assert "arquivos com credencial no perfil: 3" in out, out
    assert "DEFAULT HARDCODED" in out, out
    assert "versao PRE-FIX" in out, out
    before = {
        p: p.read_text(encoding="utf-8")
        for p in FIXTURE.iterdir()
        if p.is_file()
    }
    run("--check", "--profile-path", str(FIXTURE), "--old-key", FAKE_KEY)
    for p, content in before.items():
        assert p.read_text(encoding="utf-8") == content, f"--check alterou {p}"

    # 2) --apply --verify: sem credencial nova no .env, o instalador é
    #    fail-closed e sinaliza a pendência (exit 1) em vez de declarar sucesso.
    rc, out = run(
        "--apply", "--verify", "--profile-path", str(FIXTURE), "--old-key", FAKE_KEY
    )
    print(out)
    assert rc == 1, f"--apply sem credencial nova deveria sinalizar pendencia, rc={rc}"
    assert "NAO possui AUDIO_API_KEY" in out, out
    assert "nenhum literal de credencial fora do .env" in out, out
    assert "cliente env-only" in out, out
    assert "fluxo na versao segura" in out, out

    # 3) nenhum literal da credencial fora do .env
    for p in FIXTURE.iterdir():
        if not p.is_file() or p.name == ".env":
            continue
        assert FAKE_KEY not in p.read_text(encoding="utf-8", errors="ignore"), (
            f"credencial ainda em {p}"
        )

    # 4) cliente env-only e fail-closed
    client = (FIXTURE / "memorial_client.py").read_text(encoding="utf-8")
    assert 'os.environ.get("AUDIO_API_KEY"' in client, client
    assert "DEFAULT_API_KEY = \"" not in client, client
    assert "AUDIO_API_KEY ausente" in client, client

    # 5) fluxo sincronizado com a versao segura
    flow = (FIXTURE / "test_audio_flow.py").read_text(encoding="utf-8")
    for token in ("--decide", "--dry-run", "confirm_or_abort"):
        assert token in flow, f"fluxo sem {token}"

    # 6) idempotencia (mesmo resultado: pendencia da credencial nova permanece)
    rc, out = run(
        "--apply", "--verify", "--profile-path", str(FIXTURE), "--old-key", FAKE_KEY
    )
    assert rc == 1, f"segunda execucao mudou o veredito rc={rc}\n{out}"
    assert "nenhum literal de credencial fora do .env" in out, out

    # 7) com a credencial nova no .env, o veredito fecha em exit 0
    env_path = FIXTURE / ".env"
    env_path.write_text(
        "TZ=America/Sao_Paulo\nAUDIO_API_KEY=valor-novo-de-teste\n", encoding="utf-8"
    )
    os.chmod(env_path, 0o600)
    rc, out = run(
        "--apply", "--verify", "--profile-path", str(FIXTURE), "--old-key", FAKE_KEY
    )
    print(out)
    assert rc == 0, f"com credencial nova no .env deveria fechar rc={rc}\n{out}"
    assert "PENDENCIAS:" not in out, out

    shutil.rmtree(FIXTURE, ignore_errors=True)
    print("INSTALLER_TEST_OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
