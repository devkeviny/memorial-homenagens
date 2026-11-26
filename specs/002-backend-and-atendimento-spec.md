# Especificação de Back-end, Perfil Isolado & Pipeline de Áudio: Memorial Homenagens
**Status:** Proposta para Validação (Etapa 3)  
**Versão:** 1.0.0 (SDD Spec-Kit)  
**Projeto:** `devkeviny/memorial-homenagens`  
**Workspace:** `/opt/data/worktrees/memorial-homenagens/specs`  

---

## 1. Visão Geral & Objetivos da Etapa 3

Construir e validar a arquitetura de atendimento ao público do **Memorial de Homenagens**, garantindo isolamento total de segurança, fluxo conversacional acolhedor e geração de áudios de homenagem (vinhetas) através do microserviço central `audio-service`.

### Requisitos Inegociáveis:
1. **Isolamento Unidirecional (Container Separado):** O atendimento público roda em container isolado gerenciado pelo Coolify. O perfil de atendimento não tem acesso a terminal, `session_search`, arquivos locais do host, credenciais globais ou memórias de outros perfis. Sage/Kevinny mantêm observabilidade e controle externo via logs e Docker socket.
2. **Fuso Horário Estrito:** Todos os horários de cerimônia, datas e eventos calculados ou formatados no fuso oficial `America/Sao_Paulo`.
3. **Trava de Confirmação Obrigatória:** O bot/back-end **NUNCA** gera áudio ou arte automaticamente. Ele deve apresentar um card estruturado com todos os dados coletados e aguardar o clique explícito do usuário em `✓ Confirmar e Gerar`.
4. **Vozes Pré-Configuradas:** O familiar não clona voz. O sistema oferece vozes pré-configuradas no `audio-service` (Voz Solene Masculina e Voz Solene Feminina).
5. **Motor de Síntese:** Motor primário `fish-audio/s2.1-pro-free:free` via OpenRouter, com fallback automático no `k2-fsa/OmniVoice` INT8 local.

---

## 2. Especificação do Fluxo Conversacional de Atendimento

O fluxo de atendimento segue 4 fases bem definidas:

```
[ 1. ACOLHIMENTO ] -> [ 2. COLETA GUIADA ] -> [ 3. TRAVA DE CONFIRMAÇÃO ] -> [ 4. SÍNTESE & ENTREGA ]
Mensagem de respeito  Coleta dados e datas   Card interativo com dados      Chamada ao audio-service
e escuta compassiva   (America/Sao_Paulo)    Aguardando botão do usuário    Player de áudio no chat
```

### 2.1 Coleta de Dados Estruturados:
- Nome completo do homenageado(a)
- Datas: nascimento e falecimento (formato `DD/MM/AAAA`)
- Cidade e Estado (para contextualização e sepultamento)
- Dados da Cerimônia: Local do velório, horário, sala e horário do sepultamento/cremação
- Mensagem ou oração escolhida (ou sugestão automática baseada no perfil)
- Escolha da voz solene:
  - `voz-solene-masculina` (tom grave, sereno, respeitoso)
  - `voz-solene-feminina` (tom suave, terno, consolador)

### 2.2 Regra de Ouro da Trava de Confirmação:
Antes de qualquer chamada à API de geração, o agente emite uma resposta estruturada de confirmação:
```json
{
  "type": "confirmation_card",
  "data": {
    "nome": "João da Silva",
    "datas": "15/04/1954 a 20/11/2026",
    "idade": "72 anos",
    "cidade": "São Paulo/SP",
    "cerimonia": "Velório Municipal, Sala 02 — Sepultamento às 16h",
    "mensagem": "Sua memória permanecerá viva em cada coração que tocou.",
    "voz": "voz-solene-masculina"
  },
  "actions": [
    { "id": "confirm_generate", "label": "✓ Tudo certo, gerar vinheta", "action": "generate" },
    { "id": "edit_info", "label": "✎ Alterar dados", "action": "edit" }
  ]
}
```

---

## 3. Especificação do Perfil Isolado & Skills

### 3.1 Perfil `memorial-atendimento`:
- **Diretório:** `/home/hermes/.hermes/profiles/memorial-atendimento/` (ou montado via volume Docker).
- **Ferramentas Bloqueadas:** `terminal`, `browser_exec`, `session_search`, `write_file`, `memory`.
- **Ferramentas Permitidas:** `audio_service_synthesize`, `get_current_time_sp`, `validate_memorial_data`.
- **Memória:** `memory.enabled: false`, `session_history: isolated`.
- **System Prompt / SOUL:** Tom solene, empático, conciso, acolhedor e focado exclusivamente na homenagem fúnebre.

### 3.2 Skill `memorial-coleta-dados`:
- Validação e parsing de datas com verificação de fuso `America/Sao_Paulo`.
- Identificação de lacunas (ex: se o usuário não informou horário do sepultamento, pergunta de forma delicada).
- Geração do roteiro solene com introdução, mensagem de despedida e informações práticas do velório.

### 3.3 Skill `memorial-audio-pipeline`:
- Formatação do texto com tags expressivas para o `fish-audio` (pausas, ritmo lento, entonação calma) ou texto limpo para o `OmniVoice`.
- Envio assíncrono para o `audio-service` (`POST /v1/tts/jobs`).
- Polling do status (`GET /v1/jobs/{job_id}`) até conclusão.
- Retorno da URL do arquivo de áudio para streaming direto no frontend.

---

## 4. Contratos de API & Integração com o Front-end

### 4.1 Endpoint de Chat / Atendimento:
`POST /api/memorial/chat`
- **Request:**
  ```json
  {
    "session_id": "mem_sess_9a8b7c",
    "message": "Gostaria de fazer uma homenagem ao meu avô João",
    "state": { ... }
  }
  ```
- **Response:**
  ```json
  {
    "reply": "Meus sinceros sentimentos pela partida do seu avô João...",
    "state": { ... },
    "confirmation_card": null,
    "audio_ready": null
  }
  ```

### 4.2 Endpoint de Disparo de Síntese de Vinheta:
`POST /api/memorial/vinheta/generate`
- **Trigger:** Chamado exclusivamente quando o usuário clica em `✓ Tudo certo, gerar vinheta`.
- **Payload:**
  ```json
  {
    "session_id": "mem_sess_9a8b7c",
    "script": "Texto solene aprovado...",
    "voice_profile": "voz-solene-masculina"
  }
  ```
- **Response:** Retorna `job_id`, que o frontend acompanha até exibir o player no chat.

---

## 5. Critérios de Aceite da Etapa 3
1. Arquivos de configuração do perfil isolado definidos com restrição estrita de ferramentas.
2. Skill de atendimento criada com validação de datas no fuso de Brasília (`America/Sao_Paulo`).
3. Trava de confirmação via botão implementada e testada no fluxo.
4. Teste de síntese ponta a ponta gerando áudio WAV/MP3 real através do `audio-service`.
5. Parada de aprovação para decisão do Kevinny antes de iniciar a Etapa 4 (Imagens).
