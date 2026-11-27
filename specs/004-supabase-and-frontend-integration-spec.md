# SPECIFICATION: ETAPA 5 — BANCO DE DADOS SUPABASE E INTEGRAÇÃO FRONT-END
Projeto: Memorial de Homenagens (devkeviny/memorial-homenagens)
Data: 2026-11-26
Status: DRAFT

## 1. Visão Geral
A Etapa 5 é a última etapa do roadmap do Memorial de Homenagens. Ela integra a aplicação front-end com persistência remota no **Supabase** (ou schema local com fallback transparente via localStorage) e unifica todos os fluxos:
1. **Atendimento / Chat:** Coleta de dados com o perfil isolado `memorial-atendimento` e acionamento do `audio-service`.
2. **Geração de Áudio:** Vinheta narrada solene (WAV/MP3) com confirmação explícita do usuário.
3. **Geração de Artes:** Feed 3:4 e Stories 9:16 gerados via Canvas em alta resolução.
4. **Persistência de Homenagens:** Tabela `homenagens` no Supabase com suporte a:
   - `id` (UUID)
   - `nome_falecido` (texto)
   - `ano_nascimento` / `ano_falecimento` (inteiros ou datas)
   - `cidade_cerimonia` / `local_cerimonia` (texto)
   - `horario_cerimonia` (texto/timestamp em `America/Sao_Paulo`)
   - `mensagem_homenagem` (texto)
   - `audio_url` (texto opcional)
   - `artes_urls` (JSON com feed_url, story_url, perfil_url)
   - `created_at` (timestamp)
5. **Histórico Front-end (`HistoricoScreen`):** Leitura unificada do banco e/ou do cache local, permitindo ao usuário revisitar e baixar novamente suas homenagens.

## 2. Contrato de Conexão com Supabase
- **Variáveis de Ambiente Frontend (Vite):**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Fallback Resiliente:** Caso as variáveis não estejam configuradas localmente no momento do build ou o serviço esteja inacessível, o cliente deve operar em modo offline/híbrido elegante (`localStorage`), garantindo que o front-end nunca quebre ou apresente tela branca.
- **Segurança de Credenciais:** Nenhuma chave `service_role` ou segredo deve estar presente no bundle cliente. Somente `anon_key` com políticas RLS (Row Level Security) públicas de leitura e inserção de homenagens.

## 3. Critérios de Aceite para Etapa 5
1. **Cliente Supabase Implementado (`src/lib/supabase.ts`):** Inicialização tipada com fallback gracioso.
2. **Schema SQL Documentado:** Arquivo `specs/004-supabase-schema.sql` com DDL completo, índices e RLS.
3. **Integração no ChatScreen:** Ao concluir a geração de vinheta e artes, os metadados são salvos no banco.
4. **Integração no HistoricoScreen:** O histórico exibe as homenagens salvas com opções de reprodução de áudio e download de artes.
5. **Compilação e Build:** `npm run build` com saída exit 0 sem erros de TypeScript ou bundle.
6. **Auditoria Adversarial:** Bot Reviewer valida em browser real (Chromium CDP) a criação, persistência e visualização no histórico.
