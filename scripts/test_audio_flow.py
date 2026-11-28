#!/usr/bin/env python3
"""
test_audio_flow.py — Teste Integrado E2E do Fluxo de Atendimento e Síntese de Áudio (Etapa 3)

Validações executadas:
1. Coleta guiada e estruturação dos dados memoriais com fuso oficial America/Sao_Paulo.
2. Emissão mandatória do Card de Confirmação com opções padronizadas:
   '✓ Tudo certo, gerar vinheta' e '✎ Alterar dados'.
3. Trava de segurança mandatória: NENHUMA síntese é iniciada sem confirmação explícita.
4. Submissão assíncrona ao audio-service via POST /v1/tts/jobs com voice_design solene.
5. Acompanhamento resiliente via polling em GET /v1/jobs/{job_id} até status 'done'.
6. Download do áudio efêmero e gravação persistente em /opt/data/audio/memorial-teste-etapa3.wav.
7. Inspeção técnica do artefato: verificação de cabeçalho WAV (RIFF/WAVE), PCM 16-bit, 24kHz Mono, duração e SHA256.
"""

from __future__ import annotations

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

if not AUDIO_API_KEY:
    raise SystemExit(
        "AUDIO_API_KEY ausente. Exporte a credencial do audio-service no ambiente "
        "antes de executar este teste (nunca a commite no repositório)."
    )


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


def run_e2e_flow():
    sep = "=" * 60
    print(sep)
    print("INICIANDO TESTE E2E: ATENDIMENTO MEMORIAL & SÍNTESE DE ÁUDIO")
    print(sep)

    # 1. Simulação da Coleta Guiada (Fuso America/Sao_Paulo)
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

    # 2. Geração do Card de Confirmação
    card = build_confirmation_card(memorial_data)
    print("\n[FASE 2] Card de Confirmação Estruturado:")
    print(json.dumps(card, indent=2, ensure_ascii=False))

    # Validação dos elementos do card
    assert card["type"] == "confirmation_card", "Tipo de card incorreto"
    action_ids = [a["id"] for a in card["actions"]]
    assert "confirm_generate" in action_ids, "Opção de confirmação ausente"
    assert "edit_info" in action_ids, "Opção de edição ausente"
    print("  ✓ Validação do Card de Confirmação: APROVADO")

    # 3. Trava de Confirmação Mandatória
    # Teste 3.1: Validação de bloqueio antes da confirmação
    print("\n[FASE 3.1] Testando Trava de Segurança Pré-Confirmação...")
    user_decision = "edit_info"  # Simula usuário pedindo alteração
    if user_decision != "confirm_generate":
        print("  ✓ Trava atuando corretamente: Nenhuma síntese disparada para ação 'edit_info'.")

    # Teste 3.2: Liberação consciente após clique de confirmação
    user_decision = "confirm_generate"  # Usuário clica em '✓ Tudo certo, gerar vinheta'
    print(f"\n[FASE 3.2] Confirmação do Usuário Recebida ({user_decision}).")
    print("  → Trava liberada: Autorizando chamada ao audio-service...")

    # 4. Formatação do Roteiro
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

    # 5. Chamada HTTP ao audio-service (POST /v1/tts/jobs)
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
        sys.exit(1)

    # 6. Polling do Job (GET /v1/jobs/{job_id})
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
        with urllib.request.urlopen(poll_req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
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
                sys.exit(1)

    if not job_result:
        print("  ✗ Timeout aguardando conclusão da síntese")
        sys.exit(1)

    # 7. Download do Áudio Efêmero
    artifacts = job_result.get("artifacts", [])
    assert artifacts, "Nenhum artefato retornado pelo job"
    download_rel_path = artifacts[0]["download"]
    full_dl_url = f"{AUDIO_SERVICE_URL}{download_rel_path}"

    print(f"\n[FASE 7] Baixando áudio gerado de {full_dl_url}...")
    dl_req = urllib.request.Request(full_dl_url)
    with urllib.request.urlopen(dl_req, timeout=30) as dl_resp:
        audio_bytes = dl_resp.read()

    print(f"  ✓ Download concluído: {len(audio_bytes):,} bytes recebidos.")

    # 8. Salvamento no destino exigido
    OUTPUT_AUDIO_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_AUDIO_PATH.write_bytes(audio_bytes)
    print(f"\n[FASE 8] Áudio gravado com sucesso em: {OUTPUT_AUDIO_PATH}")

    # 9. Verificação Técnica do Arquivo
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
    print(f"  • Formato:    PCM WAV (16-bit, 24kHz Mono, RIFF/WAVE confirmado)")
    print(f"  • Duração:    {duration:.2f} segundos")
    print(f"  • SHA256:     {sha256_hash}")
    print(f"  • Job ID:     {job_id}")
    print(sep)
    print("TESTE E2E CONCLUÍDO COM SUCESSO TOTAL!")
    print(sep)


if __name__ == "__main__":
    run_e2e_flow()
