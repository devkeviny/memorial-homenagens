# PLAN: ETAPA 4 — GERAÇÃO DE IMAGENS (FEED 3:4 E STORIES 9:16)
Projeto: Memorial de Homenagens (devkeviny/memorial-homenagens)
Data: 2026-11-26

## 1. Arquitetura do Módulo de Renderização
A geração das imagens ocorre através de renderização vetorial e matricial via Canvas HTML5 de alta resolução:
- `CanvasRenderer` embutido: renderiza elementos em resolução nativa (1080x1440 e 1080x1920) independente do DPI da tela do cliente.
- Suporte a filtros de imagem (escala de cinza, brilho, contraste) no recorte da foto.
- Inclusão de ornamentos solenes (laço preto vetorial, cruzes minimalistas, linhas duplas douradas e texturas sólidas/gradientes).

## 2. Divisão de Tarefas (Kanban)
1. **[Coder] Implementação e Refinamento dos Templates (Feed 3:4 e Stories 9:16):**
   - Garantir renderizador Canvas 1080x1440 (Feed 3:4) e 1080x1920 (Stories 9:16) com safe areas de 150px.
   - Suporte a foto do ente querido (ajuste de zoom/pan) e laço preto de luto.
   - Script de teste de renderização headless/node ou browser test para validar geração dos 2 PNGs.
2. **[Reviewer] Auditoria Visual e Técnica das Artes Geradas:**
   - Auditoria adversarial em browser real (Chromium CDP).
   - Validação de dimensões exatas (1080x1440 e 1080x1920).
   - Confirmação de ausência de prints de celular/app ou AI-slop visual.
   - Verificação de download e integridade dos arquivos PNG.
