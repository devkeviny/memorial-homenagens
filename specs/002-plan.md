# Plano Arquitetural: Perfil Isolado & Backend de Atendimento Memorial
**Status:** Em Planejamento (Etapa 3)  
**Versão:** 1.0.0 (SDD Spec-Kit)  
**Projeto:** `devkeviny/memorial-homenagens`  

---

## 1. Topologia do Sistema

```
[ Usuário no Navegador (Mobile/Desktop) ]
                   │
                   ▼ (HTTPS)
[ Frontend Memorial (Vercel / Vite) ]
                   │
                   ▼ (API REST / WebSocket)
[ Container Coolify: memorial-atendimento (Hermes Profile Isolado) ]
         │ (Zero acesso a host / sem terminal / sem memória global)
         │
         ▼ (HTTP Interno via Docker Network / Tailscale)
[ Container Coolify: audio-service (FastAPI + OmniVoice + Fish Audio) ]
```

---

## 2. Componentes e Responsabilidades

1. **Perfil Isolado `memorial-atendimento`:**
   - Baseado na imagem padrão do Hermes, configurado com profile dedicado em volume independente.
   - Variáveis sensíveis e credenciais de host completamente desabilitadas.
   - Não possui `terminal`, `browser_exec`, `session_search` ou ferramentas de escrita no sistema operacional.
   - Possui apenas a ferramenta/skill de atendimento solene e chamada ao `audio-service`.

2. **Skills Especializadas:**
   - `memorial-atendimento`: Conduz a conversa com acolhimento, extrai as entidades com fuso `America/Sao_Paulo` e gera o texto da homenagem.
   - `memorial-audio`: Dispara o job assíncrono para o `audio-service` (`POST /v1/tts/jobs`) e retorna a URL final para o chat.

3. **Trava de Confirmação no Frontend:**
   - O ChatScreen já possui a estrutura de cards de confirmação com `✓ Tudo certo, gerar` e `✎ Alterar dados`.
   - O backend emite o estado `awaiting_confirmation` com os dados estruturados e só prossegue mediante envio do evento de confirmação.
