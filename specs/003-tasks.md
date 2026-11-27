# TASKS: ETAPA 4 — GERAÇÃO DE IMAGENS (FEED 3:4 E STORIES 9:16)
Projeto: Memorial de Homenagens (devkeviny/memorial-homenagens)
Data: 2026-11-26

## Lista de Tarefas Atômicas

### Tarefa 1: [Coder] Implementação/Refinamento do Renderizador de Artes (Feed 3:4 e Stories 9:16)
- **Assignee:** `@coder`
- **Responsabilidades:**
  1. Refinar a renderização no `TemplatesArtesScreen` para garantir as resoluções exatas: 1080x1440 (Feed 3:4) e 1080x1920 (Stories 9:16).
  2. Implementar safe area de 150px no Stories 9:16.
  3. Adicionar script de renderização de teste (`scripts/render_test_artes.js` ou similar via Puppeteer/Canvas) que produza dois PNGs reais de exemplo em `/opt/data/artes-teste/`.
  4. Garantir design fúnebre solene, sem prints de celular ou AI-slop.

### Tarefa 2: [Reviewer] Auditoria Visual e Técnica com Chromium Real
- **Assignee:** `@reviewer`
- **Dependência:** Tarefa 1 ([Coder])
- **Responsabilidades:**
  1. Validar os arquivos PNG gerados (`ffprobe` / `file` / `identify`) confirmando 1080x1440 e 1080x1920.
  2. Abrir a aplicação em Chromium real, testar o fluxo de seleção de template, ajuste e download.
  3. Capturar screenshots reais comprovando a qualidade visual e ausência de cortes ou deformações.
  4. Documentar saídas de comando reais e emitir veredito.
