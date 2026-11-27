# SPECIFICATION: ETAPA 4 — GERAÇÃO DE IMAGENS (FEED 3:4 E STORIES 9:16)
Projeto: Memorial de Homenagens (devkeviny/memorial-homenagens)
Data: 2026-11-26
Status: DRAFT

## 1. Visão Geral
A Etapa 4 implementa e audita o pipeline de geração e renderização visual para homenagens fúnebres nos dois formatos oficiais:
1. **Feed 3:4** (1080 x 1440 px)
2. **Stories 9:16** (1080 x 1920 px)

Ambos os formatos utilizam camada HTML/CSS/Canvas nativa client-side (ou headless), garantindo alta fidelidade, exportação PNG nítida, suporte a foto do ente querido com ajuste de zoom/pan, molduras solenes e respeito estrito às regras anti-slop e identidade visual do Kevinny.

## 2. Regras Visuais e Anti-Slop (Mandatórias)
1. **NÃO gerar prints de app ou celular:** O design deve ser conceitual, solene, estilo editorial fúnebre nobre.
2. **Fundos escuros e texturas solenes:**
   - Dark graphite / velvet black (`#061811`, `#09090B`, `#0D0D11`).
   - Acentos sutis em dourado nobre (`#D4AF37`), marfim suave (`#EDEDED`) ou vermelho solene pontual (`#DC2626`).
3. **Tipografia:**
   - Títulos em fonte sem serifa pesada / display solene (Space Grotesk / Inter / serifada nobre como Playfair apenas para homenagens clássicas).
   - Sem travessões desnecessários nas legendas.
   - Tamanhos proporcionais e legíveis.
4. **Foto do Ente Querido:**
   - Suporte a foto do ente querido com posicionamento centralizado, moldura solene (oval, circular ou retangular clássica) e opção de filtro P&B respeitoso.
   - Inserção de laço preto / fita de luto discreta no canto ou na base da foto.
5. **Datas e Citações:**
   - Datas de nascimento e falecimento no formato `DD/MM/AAAA - DD/MM/AAAA` com fuso `America/Sao_Paulo`.
   - Citação respeitosa de 1-2 linhas no rodapé.

## 3. Formatos e Especificações Técnicas
- **Feed 3:4:**
  - Largura: 1080px
  - Altura: 1440px
  - Aspect Ratio: 3:4
  - Formato exportação: PNG (24-bit/32-bit), sem compressão destrutiva.
- **Stories 9:16:**
  - Largura: 1080px
  - Altura: 1920px
  - Aspect Ratio: 9:16
  - Safe Areas: 150px de respiro no topo e rodapé para evitar sobreposição de controles do Instagram/WhatsApp.
  - Formato exportação: PNG.

## 4. Templates Oficiais
1. **Solene Clássico Dourado (Feed 3:4):** Bordas duplas douradas, fundo preto aveludado, tipografia de honra.
2. **Luz de Vela Noturna (Stories 9:16):** Fundo escuro com ponto de luz suave de vela, laço de luto e citação eterna.
3. **Mármore & Saudade (Feed 3:4):** Textura sutil de pedra nobre, moldura minimalista fina, rosas brancas/vermelhas solenes.
4. **Vigília do Amor Eterno (Stories 9:16):** Layout vertical expansivo com safe area de 150px, foco na foto e oração curta.

## 5. Critérios de Aceite para Etapa 4
1. **Templates Funcionais:** Implementação dos templates Feed 3:4 e Stories 9:16 no componente `TemplatesArtesScreen` e integração com a entrega do `ChatScreen`.
2. **Renderização de Alta Resolução:** Geração via Canvas em 1080x1440 (Feed) e 1080x1920 (Stories) com download direto em PNG.
3. **Validação Visual Real:** Captura e inspeção de screenshots reais das duas artes renderizadas pelo bot Reviewer com Chromium real, comprovando ausência de cortes e resolução correta.
4. **Sem Prints de Celular:** Verificação manual/adversarial de que as artes são peças gráficas puras.
