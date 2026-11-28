#!/usr/bin/env python3
"""
test_audio_flow.py — Teste Integrado E2E do Fluxo de Atendimento e Síntese de Áudio (Etapa 3)

Validações executadas:
1. Coleta guiada e estruturação dos dados memoriais com fuso oficial America/Sao_Paulo.
2. Emissão mandatória do Card de Confirmação com opções padronizadas:
   '✓ Tudo certo, gerar vinheta' e '✎ Alterar dados'.
3. Trava de segurança real: NENHUMA síntese é iniciada sem a decisão explícita
   do usuário ('confirm_generate'). A decisão vem de --decide ou da variável
   CONFIRMATION_DECISION — nunca é auto-aprovada dentro do script.
4. Submissão assíncrona ao audio-service via POST /v1/tts/jobs com voice_design solene.
5. Acompanhamento resiliente via polling em GET /v1/jobs/{job_id} até status 'done'.
6. Download do áudio efêmero e gravação persistente em /opt/data/audio/memorial-teste-etapa3.wav.
7. Inspeção técnica do artefato: verificação de cabeçalho WAV (RIFF/WAVE), PCM 16-bit, 24kHz Mono, duração e SHA256.

Uso:
  # prova a barreira: nenhuma chamada externa é feita
  python3 scripts/test_audio_flow.py --dry-run

  # fluxo completo (exige AUDIO_API_KEY no ambiente)
  AUDIO_API_KEY=... python3 scripts/test_audio_flow.py --decide confirm_generate

  # simula o usuário pedindo alteração (trava deve barrar)
  AUDIO_API_KEY=... python3 scripts/test_audio_flow.py --decide edit_info
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
import urllib.request
import wave
from pathlib import Path

# Configurações do serviço de áudio
# A URL e a credencial NUNCA são fixadas no código: ambas vêm do ambiente.
# Default unificado com o cliente de atendimento (mesmo host sslip.io).
AUDIO_SERVICE_URL = os.environ.get("AUDIO_SERVICE_URL", "http://10.0.9.1.sslip.io:18080").rstrip("/")
AUDIO_API_KEY = os.environ.get("AUDIO_API_KEY", "")
OUTPUT_AUDIO_PATH = Path(os.environ.get("MEMORIAL_AUDIO_OUTPUT", "/opt/data/audio/memorial-teste-etapa3.wav"))


def parse_args(argv=None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Teste E2E do fluxo de atendimento e síntese do Memorial (Etapa 3)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Executa coleta, card e trava sem chamar o audio-service "
             "(não exige AUDIO_API_KEY e não gera áudio).",
    )
    parser.add_argument(
        "--decide",
        choices=["confirm_generate", "edit_info"],
        default=None,
        help="Decisão do usuário no card de confirmação. Se omitido, é lida de "
             "CONFIRMATION_DECISION no ambiente (padrão: 'edit_info' = trava acting).",
    )
    return parser.parse_args(argv)


def build_confirmation_card(data: dict) -> dict:
    """Gera a estrutura JSON padronizada do Card de Confirmação com trava de segurança."""
    return {
        "type": "confirmation_card",
        "data": {
            "nome": data["nome"],
            "datas": f"{data['data_nascimento']} a {data['data_falecimento']}",
            "cidade": data["cidade"],
            "cerimonia": f"{data['local_sepultamento']} às {data['horario_sepultamento']}",
            "mensagem": data["mensagem"],
            "voz": data["voz"],
        },
        "actions": [
            {
                "id": "confirm_generate",
                "label": "✓ Tudo certo, gerar vinheta",
                "action": "generate",
            },
            {
                "id": "edit_info",
                "label": "✎ Alterar dados",
                "action": "edit",
            },
        ],
    }


def confirm_or_abort(card: dict, decision: str) -> bool:
    """Barreira real de confirmação.

    Nenhuma chamada ao audio-service acontece antes que a decisão seja
    explicitamente 'confirm_generate'. A decisão NÃO é auto-aprovada dentro do
    script: ela chega por --decide ou por CONFIRMATION_DECISION, que representa
    o clique real do usuário no Card de Confirmação (1:1 com os action_ids do
    card). Qualquer valor fora do conjunto → aborta sem síntese.
    """
    valid_ids = {action["id"] for action in card.get("actions", [])}
    if decision not in valid_ids:
        raise SystemExit(
            f"Decisão inválida {decision!r}: esperado um dos action_ids do card {sorted(valid_ids)}."
        )
    if decision != "confirm_generate":
        print(f"  ✋ Trava atuando: decisão '{decision}' — nenhuma síntese disparada.")
        return False
    print("  ✓ Confirmação explícita recebida ('confirm_generate'): trava liberada.")
    return True


def format_solemn_script(data: dict) -> str:
    """
    Monta o roteiro solene respeitoso para síntese vocal.
    Contém abertura, menção a datas/sepultamento em horário de Brasília e consolo final.
    Cadência concisa e pausada para síntese de alta fidelidade no OmniVoice.
    """
    horario_fuso = data["horario_sepultamento"].split("(")[0].strip()
    return f"Homenagem a {data['nome']}. Sepultamento às {horario_fuso}. Descanse em paz."


def resolve_voice_design(voice_profile: str) -> dict:
    """Mapeia o perfil amigável para atributos nativos do OmniVoice."""
    if voice_profile == "voz-solene-masculina":
        return {
            "gender": "male",
            "age": "middle-aged",
            "pitch": "low pitch",
            "accent": "portuguese accent",
        }
    return {
        "gender": "female",
        "age": "middle-aged",
        "pitch": "moderate pitch",
        "accent": "portuguese accent",
    }


def run_e2e_flow(args: argparse.Namespace | None = None) -> int:
    if args is None:
        args = parse_args()
    sep = "=" * 60
    print(sep)
    print("INICIANDO TESTE E2E: ATENDIMENTO MEMORIAL & SÍNTESE DE ÁUDIO")
    print(sep)

    # 1. Coleta guiada (fuso America/Sao_Paulo)
    memorial_data = {
        "nome": "Dona Maria Francisca",
        "data_nascimento": "12/03/1945",
        "data_falecimento": "25/11/2026",
        "cidade": "Salvador/BA",
        "local_sepultamento": "Cemitério Campo Santo, Capela 3",
        "horario_sepultamento": "16:30 de Brasília (America/Sao_Paulo)",
        "mensagem": "Sua luz permanecerá viva em nossos corações.",
        "voz": "voz-solene-feminina",
    }

    print("\n[FASE 1] Dados Memoriais Coletados:")
    for k, v in memorial_data.items():
        print(f"  • {k}: {v}")

    # 2. Card de Confirmação
    card = build_confirmation_card(memorial_data)
    print("\n[FASE 2] Card de Confirmação Estruturado:")
    print(json.dumps(card, indent=2, ensure_ascii=False))

    assert card["type"] == "confirmation_card", "Tipo de card incorreto"
    action_ids = [a["id"] for a in card["actions"]]
    assert "confirm_generate" in action_ids, "Opção de confirmação ausente"
    assert "edit_info" in action_ids, "Opção de edição ausente"
    print("  ✓ Validação do Card de Confirmação: APROVADO")

    # 3. Trava de Confirmação (barreira real, decisão externa ao script)
    print("\n[FASE 3.1] Testando Trava de Segurança Pré-Confirmação...")
    decision = args.decide or os.environ.get("CONFIRMATION_DECISION", "edit_info")
    if not confirm_or_abort(card, decision):
        print("\n" + sep)
        print("TESTE E2E ENCERRADO NA TRAVA DE CONFIRMAÇÃO (nenhuma síntese efetuada).")
        print(sep)
        return 0

    print("\n[FASE 3.2] Confirmação do Usuário Recebida.")
    print("  → Trava liberada: Autorizando chamada ao audio-service...")

    if args.dry_run:
        print("\n[FASE 4] --dry-run: nenhuma chamada externa será feita.")
        print("\n" + sep)
        print("TESTE E2E (DRY-RUN) CONCLUÍDO: card e barreira validados.")
        print(sep)
        return 0

    if not AUDIO_API_KEY:
        raise SystemExit(
            "AUDIO_API_KEY ausente. Exporte a credencial do audio-service no ambiente "
            "antes de executar a síntese (nunca a commite no repositório)."
        )

    # 4. Roteiro solene
    script_text = format_solemn_script(memorial_data)
    print(f"\n[FASE 4] Roteiro Solene Gerado ({len(script_text)} caracteres):")
    print(f'  "{script_text}"')

    voice_design = resolve_voice_design(memorial_data["voz"])
    payload = {
        "model": "omnivoice-q4",
        "input": script_text,
        "language": "pt",
        "voice_design": voice_design,
        "speed": 0.95,
        "response_format": "wav",
    }

    # 5. POST /v1/tts/jobs
    headers = {
        "Authorization": f"Bearer {AUDIO_API_KEY}",
        "Content-Type": "application/json",
    }

    submit_url = f"{AUDIO_SERVICE_URL}/v1/tts/jobs"
    print(f"\n[FASE 5] Enviando job assíncrono para {submit_url}...")
    req = urllib.request.Request(
        submit_url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            assert resp.status == 202, f"Esperado status 202, recebido {resp.status}"
            job_info = json.loads(resp.read().decode("utf-8"))
            job_id = job_info["job_id"]
            print(f"  ✓ Job submetido com sucesso! ID: {job_id} (status: {job_info.get('status')})")
    except Exception as exc:
        print(f"  ✗ Erro ao submeter job ao audio-service: {exc}")
        return 1

    # 6. Polling
    poll_url = f"{AUDIO_SERVICE_URL}/v1/jobs/{job_id}"
    print(f"\n[FASE 6] Acompanhando processamento via polling em {poll_url}...")

    # Timeout de polling: fallback local OmniVoice em CPU consome ~420s +
    # cold-start de 40-60s. O teto mínimo é 480-600s (regra do skill
    # solemn-memorial-audio-pipeline). 240s causariam falso timeout.
    max_attempts = 300  # 300 x 2s = 600s
    job_result = None

    for attempt in range(max_attempts):
        time.sleep(2)
        poll_req = urllib.request.Request(poll_url, headers=headers)
        try:
            with urllib.request.urlopen(poll_req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except Exception as exc:
            print(f"  ✗ Erro no polling: {exc}")
            return 1
        status = data.get("status")
        stage = data.get("stage")
        progress = data.get("progress", 0.0)

        if attempt % 5 == 0 or status in ("done", "failed"):
            print(f"  [{attempt * 2}s] status={status} | stage={stage} | progress={progress:.1%}")

        if status == "done":
            job_result = data
            break
        if status == "failed":
            print(f"  ✗ Falha na síntese: {data.get('error')}")
            return 1

    if not job_result:
        print("  ✗ Timeout aguardando conclusão da síntese")
        return 1

    # 7. Download do áudio
    artifacts = job_result.get("artifacts", [])
    assert artifacts, "Nenhum artefato retornado pelo job"
    download_rel_path = artifacts[0]["download"]
    full_dl_url = f"{AUDIO_SERVICE_URL}{download_rel_path}"

    print(f"\n[FASE 7] Baixando áudio gerado de {full_dl_url}...")
    dl_req = urllib.request.Request(full_dl_url)
    with urllib.request.urlopen(dl_req, timeout=30) as dl_resp:
        audio_bytes = dl_resp.read()

    print(f"  ✓ Download concluído: {len(audio_bytes):,} bytes recebidos.")

    # 8. Persistência
    OUTPUT_AUDIO_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_AUDIO_PATH.write_bytes(audio_bytes)
    print(f"\n[FASE 8] Áudio gravado com sucesso em: {OUTPUT_AUDIO_PATH}")

    # 9. Verificação técnica
    assert OUTPUT_AUDIO_PATH.is_file(), "Arquivo não existe no disco"
    file_size = OUTPUT_AUDIO_PATH.stat().st_size
    assert file_size > 50_000, f"Arquivo muito pequeno ({file_size} bytes)"

    with wave.open(str(OUTPUT_AUDIO_PATH), "rb") as w:
        channels = w.getnchannels()
        sample_rate = w.getframerate()
        sampwidth = w.getsampwidth()
        n_frames = w.getnframes()
        duration = n_frames / sample_rate

    assert channels == 1, f"Esperado 1 canal (mono), obtido {channels}"
    assert sample_rate == 24000, f"Esperado sample_rate 24000 Hz, obtido {sample_rate}"
    assert sampwidth == 2, f"Esperado 16-bit PCM (2 bytes), obtido {sampwidth}"
    assert duration > 1.0, f"Duração muito curta: {duration}s"

    sha256_hash = hashlib.sha256(audio_bytes).hexdigest()

    print("\n" + sep)
    print("VERIFICAÇÃO TÉCNICA DO ARTEFATO FINAL:")
    print(sep)
    print(f"  • Caminho:    {OUTPUT_AUDIO_PATH.resolve()}")
    print(f"  • Tamanho:    {file_size:,} bytes ({file_size / 1024:.1f} KB)")
    print("  • Formato:    PCM WAV (16-bit, 24kHz Mono, RIFF/WAVE confirmado)")
    print(f"  • Duração:    {duration:.2f} segundos")
    print(f"  • SHA256:     {sha256_hash}")
    print(f"  • Job ID:     {job_id}")
    print(sep)
    print("TESTE E2E CONCLUÍDO COM SUCESSO TOTAL!")
    print(sep)
    return 0


if __name__ == "__main__":
    sys.exit(run_e2e_flow())
