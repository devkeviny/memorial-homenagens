# TASKS: ETAPA 5 — BANCO DE DADOS SUPABASE E INTEGRAÇÃO FRONT-END
Projeto: Memorial de Homenagens (devkeviny/memorial-homenagens)
Data: 2026-11-26

## Lista de Tarefas Atômicas

### Tarefa 1: [Coder] Integração com Supabase e Unificação Front-end
- **Assignee:** `@coder`
- **Workspace:** `/opt/data/worktrees/memorial-homenagens`
- **Responsabilidades:**
  1. Instalar `@supabase/supabase-js` caso necessário ou criar cliente HTTP nativo/resiliente em `src/lib/supabase.ts`.
  2. Implementar schema tipado e fallback transparente em `localStorage` quando as credenciais não estiverem no env.
  3. Conectar a finalização da homenagem no `ChatScreen.tsx` e `TemplatesArtesScreen.tsx` para persistir no Supabase e no histórico.
  4. Atualizar `HistoricoScreen.tsx` para carregar do banco de dados com cache local.
  5. Garantir que `npm run build` passa 100% limpo sem erros de tipagem.

### Tarefa 2: [Reviewer] Auditoria Adversarial Ponta a Ponta
- **Assignee:** `@reviewer`
- **Dependência:** Tarefa 1 ([Coder])
- **Responsabilidades:**
  1. Auditar `src/lib/supabase.ts` verificando que não há segredos embutidos (`service_role` proibido no client).
  2. Verificar fallback de resiliência caso `VITE_SUPABASE_URL` não esteja presente.
  3. Executar browser real (Chromium CDP) e validar o fluxo completo: Home -> Artes/Chat -> Geração -> Histórico.
  4. Capturar screenshots reais comprovando persistência e renderização no histórico.
  5. Emitir veredito final da Etapa 5.
