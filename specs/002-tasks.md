# Tarefas de Implementação: Etapa 3 (Spec-Kit)
**Projeto:** `devkeviny/memorial-homenagens`  
**Escopo:** Perfil Isolado + Skills + Back-end de Áudio  

---

## Fases de Execução

### Fase 1: Perfil Isolado de Atendimento
- [ ] **T3.1 — Especificar e criar o perfil `memorial-atendimento`**
  - Diretório de configuração com `profile.yaml`, `config.yaml` travado.
  - Desativar `memory`, `session_search`, `terminal`, `browser_exec`.
  - Configurar `SOUL.md` solene focado em homenagens póstumas.

### Fase 2: Skills de Atendimento
- [ ] **T3.2 — Criar a skill `memorial-atendimento`**
  - Implementar lógica de acolhimento e coleta guiada de dados.
  - Implementar normalização de datas e horários no fuso `America/Sao_Paulo`.
  - Implementar emissão do card de confirmação antes de qualquer disparo de áudio.

- [ ] **T3.3 — Criar a skill `memorial-audio-client`**
  - Implementar integração HTTP com o `audio-service` (`POST /v1/tts/jobs` e `GET /v1/jobs/{id}`).
  - Formatar texto com pontuação adequada para síntese respeitosa.

### Fase 3: Validação Ponta a Ponta
- [ ] **T3.4 — Teste integrado do fluxo de atendimento e síntese**
  - Simular conversa completa de acolhimento e coleta.
  - Verificar acionamento da trava de confirmação (botão explícito).
  - Validar geração real de vinheta de teste pelo `audio-service`.

- [ ] **T3.5 — Parada de aprovação (Kevinny Gate)**
  - Apresentar áudio gerado, evidências de isolamento e aguardar OK para Etapa 4 (Imagens).
