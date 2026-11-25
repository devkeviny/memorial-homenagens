# AGENTS.md — Memorial Homenagens

Guia para agentes (humanos ou IA) que trabalham neste repositório. Leia antes de agir.

## Visão do projeto

**Memorial Homenagens & Vinhetas Fúnebres**: aplicação web (SPA) para criar homenagens memoriais, artes e vinhetas fúnebres. Telas principais em `src/screens/`: Home, Artes (submenu e templates), Editor de Perfil, Chat, Histórico, Sobre e Privacidade. Inclui modal de PIX, tutorial e editor de imagem via canvas.

- Repositório: https://github.com/devkeviny/memorial-homenagens
- Especificação: `specs/001-frontend-spec.md`

## Stack

- React 19 + TypeScript (strict)
- Vite 8 (`@vitejs/plugin-react`)
- Tailwind CSS 4 (`@tailwindcss/vite`)
- framer-motion / motion, lucide-react, canvas-confetti
- Hospedagem: Vercel (conta gratuita, projeto vinculado em `.vercel/`, ignorado no git)

## Estrutura

```
src/
  App.tsx, main.tsx, index.css, types.ts
  screens/      # telas da aplicação
  components/   # Sidebar, MobileHeader, PixModal, TutorialModal, ImageTouchModal, DynamicOrb, BlurText
  utils/        # canvasHelper.ts
  assets/       # SVGs e design-tokens.json
public/assets/  # imagens de fundo (jpg/webp/jxl), SVGs, design tokens
specs/          # especificações
```

## Comandos

```bash
npm install       # dependências
npm run dev       # servidor Vite em http://localhost:3000 (host: true)
npm run build     # tsc (checagem de tipos) + vite build -> dist/
npm run preview   # serve o build de produção localmente
```

Não há script de testes nem lint configurado. A verificação mínima é `npm run build` sem erros.

## Convenções

- TypeScript strict; componentes funcionais React em `.tsx`.
- Uma tela por arquivo em `src/screens/` (`<Nome>Screen.tsx`); componentes reutilizáveis em `src/components/`.
- Estilo via classes Tailwind; tokens de design em `design-tokens.json`.
- Assets estáticos em `public/assets/` (preferir `.webp`, com fallback `.jpg`).
- UI mobile-first, textos em PT-BR.
- Commits descritivos no padrão Conventional Commits (`feat:`, `fix(ui):`, `docs:` ...), autor `devkeviny <kevinnyfonseca@gmail.com>`.
- Trabalho de código em git worktrees isoladas; não editar o checkout principal concorrentemente.

## Regras globais para agentes

1. **Leia antes:** este `AGENTS.md` (e `CLAUDE.md`, se existir).
2. **Sincronize antes:** `git pull --ff-only` antes de começar. Se falhar (divergência), pare e reporte; não force merge/rebase.
3. **Entregue depois:** ao terminar, `git commit` com mensagem descritiva + `git push`. Confirme antes que a credencial tem permissão de escrita.
4. **Segredos:** nunca commite `.env`, `.env.*`, tokens, chaves ou credenciais. Revise `git diff --cached` e o `.gitignore` antes de cada commit.
5. **Vercel:** conta gratuita, sem deploy automático. Não acione deploys na Vercel sem pedido explícito do Kevinny.
6. **Obsidian:** registre mudanças relevantes (o quê, onde, por quê, evidência) no vault do Obsidian (`/opt/data/obsidian-vault/`).
7. **Evidência real:** só conta saída real de comandos (build, curl, grep, logs). Nada de resultados simulados.
