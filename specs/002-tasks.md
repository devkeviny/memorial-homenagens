# Tarefas de Implementação: Etapa 3 (Spec-Kit)
**Projeto:** `devkeviny/memorial-homenagens`  
**Escopo:** Perfil Isolado + Skills + Back-end de Áudio  

---

## Fases de Execução

### Fase 1: Perfil Isolado de Atendimento
- [x] **T3.1 — Especificar e criar o perfil `memorial-atendimento`**
  - Diretório de configuração com `profile.yaml`, `config.yaml` travado.
  - Desativar `memory`, `session_search`, `terminal`, `browser_exec`.
  - Configurar `SOUL.md` solene focado em homenagens póstumas.
  - **Evidência (2026-11-27, bot Default/orquestrador):** perfil criado em
    `/home/hermes/.hermes/profiles/memorial-atendimento/`. Auditoria do
    `config.yaml` (a partir da linha 5427) confirma `terminal`, `browser_exec`,
    `session_search`, `write_file`, `patch`, `memory` e `cronjob_manage`
    desativados; `disabled_toolsets` cobre terminal/browser/cron/session_search/
    memory/code_execution/computer_use/connections/file/web; `memory.enabled: false`;
    `session_search: false`; `approvals.mode: manual` com `cron_mode`,
    `single_query_mode` e `unattended_mode: deny`. No `profile.yaml`,
    `ui_meta.hermes-bots.enabled: false` — o perfil não orquestra nem alcança o host.

### Fase 2: Skills de Atendimento
- [x] **T3.2 — Criar a skill `memorial-atendimento`**
  - Implementar lógica de acolhimento e coleta guiada de dados.
  - Implementar normalização de datas e horários no fuso `America/Sao_Paulo`.
  - Implementar emissão do card de confirmação antes de qualquer disparo de áudio.
  - **Evidência (2026-11-27):** skill `memorial-atendimento` criada em
    `/home/hermes/.hermes/profiles/memorial-atendimento/skills/` (2026-11-27 21:20),
    com a trava de confirmação explícita e o fuso `America/Sao_Paulo` como regra
    mandatória (contrato também documentado no skill `solemn-memorial-audio-pipeline`).

- [x] **T3.3 — Criar a skill `memorial-audio-client`**
  - Implementar integração HTTP com o `audio-service` (`POST /v1/tts/jobs` e `GET /v1/jobs/{id}`).
  - Formatar texto com pontuação adequada para síntese respeitosa.
  - **Evidência (2026-11-27):** skill `memorial-audio-client` criada em
    `/home/hermes/.hermes/profiles/memorial-atendimento/skills/` (2026-11-27 21:20),
    apontando para o contrato `POST /v1/tts/jobs` + polling `GET /v1/jobs/{id}`.
    Lado servidor confirmado no repo `audio-service`: commit `b421cb2`
    ("feat(gateway): add async tts jobs endpoint and diagnostic timeout handling"),
    rota em `gateway/app/main.py` (`@app.post("/v1/tts/jobs")`, `require_api_auth`,
    `202 {job_id, status:"queued", type:"tts"}`, dedupe por `idempotency_key`,
    `429 queue_full` via `MAX_QUEUED`).

### Fase 3: Validação Ponta a Ponta
- [x] **T3.4 — Teste integrado do fluxo de atendimento e síntese**
  - Simular conversa completa de acolhimento e coleta.
  - Verificar acionamento da trava de confirmação (botão explícito).
  - Validar geração real de vinheta de teste pelo `audio-service`.
  - **Evidência (2026-11-27, execução real do bot Default/orquestrador contra o
    audio-service de produção):** `test_audio_flow.py` — coleta com fuso
    `America/Sao_Paulo` → Card de Confirmação emitido → trava de confirmação
    (`edit_info` **não** disparou síntese) → confirmação libera →
    `POST /v1/tts/jobs` → job `tts_fd63fd71241c` → polling até `done` em 110s →
    WAV baixado e validado: 307.244 bytes, PCM 16-bit 24 kHz mono, RIFF/WAVE,
    6,40s, SHA256 `373c9697…`; artefato em `/opt/data/audio/memorial-teste-etapa3.wav`.
    Suíte do gateway do `audio-service`: `tests/test_tts_async.py` → 8 passed;
    `gateway/tests/` completo → 92 passed, 3 warnings (deprecation de `on_event`
    do FastAPI, pré-existente).
  - **Correção aplicada pelo @coder no mesmo dia (commit `06a4ca3`, pushado em
    `origin/main`):** `scripts/test_audio_flow.py` deixou de embutir a credencial
    do audio-service no código (a chave estava hardcoded e published no repositório
    público) e passou a exigir `AUDIO_API_KEY` do ambiente; default de URL
    unificado em `http://10.0.9.1.sslip.io:18080`; timeout de polling elevado de
    180s para 600s, conforme a regra do skill `solemn-memorial-audio-pipeline`
    (o fallback local OmniVoice em CPU consome ~420s + cold-start).
  - **Trava de confirmação real (não auto-aprovada):** a decisão do usuário não
    é mais hardcoded dentro do script. `confirm_or_abort()` valida a decisão
    contra os `action_ids` do próprio card (`confirm_generate` | `edit_info`) e
    aborta **antes** de qualquer chamada HTTP quando a decisão não é
    `confirm_generate`. A decisão chega por `--decide` ou pela variável
    `CONFIRMATION_DECISION` (padrão: `edit_info` → trava).
    Prova real (2026-11-28, exit 0):
    `npm run test:audio:trava` → `✋ Trava atuando: decisão 'edit_info' — nenhuma
    síntese disparada.` → `TESTE E2E ENCERRADO NA TRAVA DE CONFIRMAÇÃO`;
    `npm run test:audio:trava -- --decide confirm_generate` → `✓ Confirmação
    explícita recebida ('confirm_generate'): trava liberada.` com `--dry-run`
    (nenhuma chamada externa). `npm run build` → `tsc && vite build` exit 0.
  - **Pendência de segurança aberta (não resolvida pelo @coder):** a credencial
    antiga permanece legível no **histórico** do repositório público
    (`git show e5edf1c:scripts/test_audio_flow.py` → `f392235` é ancestral de
    `origin/main`). Remover do código não rotaciona a chave: a rotação da
    `AUDIO_API_KEY` é responsabilidade de @sysops/@platform no Coolify, e o
    `memorial_client.py` do perfil `memorial-atendimento` (fora do Git) ainda
    precisa ter o `DEFAULT_API_KEY` removido pelo perfil com acesso ao path.

- [ ] **T3.5 — Parada de aprovação (Kevinny Gate)**
  - Apresentar áudio gerado, evidências de isolamento e aguardar OK para Etapa 4 (Imagens).
