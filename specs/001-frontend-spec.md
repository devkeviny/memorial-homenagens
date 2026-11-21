# Especificação de Frontend: Memorial Homenagens & Vinhetas Fúnebres
**Status:** Aprovado para Implementação  
**Versão:** 1.0.0 (SDD Spec-Kit)  
**Projeto:** `devkeviny/memorial-homenagens`  
**Workspace:** `/opt/data/worktrees/memorial-homenagens`  

---

## 1. Visão Geral & Casos de Uso
Aplicação web responsiva (Desktop e Mobile) de criação gratuita e solene de vinhetas de falecimento em áudio e artes de homenagem/luto (posts Feed 3:4, Stories 9:16 e foto de perfil com laço).

### Público-Alvo:
Familiar em luto (frequentemente idoso ou com pouca intimidade técnica) acessando pelo celular ou PC. A interface prioriza acolhimento, alta legibilidade, área de toque confortável (mínimo 48x48px) e entrada por voz além de digitação.

---

## 2. Direção de Design & Design System (Dark UI + Glassmorphism + Unslop)

### Paleta de Cores:
- **Base / Superfície Profunda:** `#0C0C0F` (Grafite Profundo) e `#16161B` (Cinza Carbono).
- **Vidro Fosco / Transparência:** `rgba(14, 14, 20, 0.90)` com `backdrop-filter: blur(14px)`.
- **Bordas Sutis:** `1px solid rgba(255, 255, 255, 0.08)`.
- **Acento / Glow Solene (Identidade):** Degradê Vermelho Profundo (`linear-gradient(135deg, #7F1D1D 0%, #DC2626 100%)`) com glow `rgba(220, 38, 38, 0.35)`.
- **Textos:** Branco Puro (`#FFFFFF`) para títulos e leitura prioritária; `#A1A1AA` para legendas e metadados.

### Fundo Simbólico:
- Textura/camada fotográfica low-key escura de flores e vasos discretos com sobreposição escura e blur para garantir contraste AAA.

### Geometria:
- Cards principais e painéis: `rounded-3xl` (`24px`).
- Botões, abas e itens de lista ativa: `rounded-full` (pílula `9999px`).
- Sem emojis soltos em títulos e badges: ícones elegantes (Lucide Icons, stroke 1.5).

---

## 3. Arquitetura das Telas e Navegação

### 3.1 Navegação Global:
- **Desktop:** Sidebar lateral esquerda com logo minimalista (pomba branca com flor vermelha), itens verticais ("Início", "Criar Vinheta", "Criar Artes", "Meu Histórico", "Sobre", "Privacidade"). Item ativo em pílula com degradê vermelho e indicador vertical luminoso na borda esquerda.
- **Mobile:** Topbar limpa com logo à esquerda e botão hambúrguer (48x48px). Ao abrir: menu fullscreen com fundo escuro translúcido, itens grandes e botão `X` grande.
- **Botão Flutuante PIX:** Canto inferior direito, estilo pílula com borda degradê vermelha. Abre Modal PIX acessível a qualquer momento com QR Code e chave copiável.

### 3.2 Tela 1 — Início (Home com Cards Bento):
- Saudação acolhedora e solene no topo.
- Grade Bento com 2 cards grandes com cantos arredondados (24px) e base com glow em degradê vermelho vibrante:
  - Card 1: **"Criar Vinheta em Áudio"** (direciona para o Chat em modo vinheta).
  - Card 2: **"Artes e Foto de Perfil"** (direciona para o Submenu de Artes).

### 3.3 Tela 2 — Submenu de Artes:
- Botão `← Voltar ao Início`.
- 2 cards Bento arredondados com degradê vermelho na base:
  - Card A: **"Foto de Perfil (Luto)"** (abre o Editor de Foto de Perfil).
  - Card B: **"Post Duplo (Feed 3:4 + Stories 9:16)"** (abre o Chat em modo arte).

### 3.4 Tela 3 — Chat Interativo em Tela Cheia:
- Estilo minimalista expansivo (Gemini / Grok / ChatGPT) ocupando toda a área útil.
- **Tutorial Inicial (Onboarding):** Modal/overlay de 3 passos na primeira visita (`localStorage: tutorial_chat_visto`).
- **Balões de Mensagem:**
  - Assistente: `#1C1C22` com texto branco 18px e avatar da pomba. Mensagem de boas-vindas com lista padrão de dados.
  - Usuário: Fundo branco puro `#FFFFFF` com texto preto `#111111` alinhado à direita para máximo contraste.
- **Feedback Dinâmico:** Orbe translúcido animado (pulsação suave vermelho/branco) com estágios: *"Pensando..."*, *"Transcrevendo áudio..."*, *"Processando áudio..."*, *"Criando imagens..."*.
- **Card de Confirmação:** Cartão escuro com resumo dos dados extraídos e botões: `"✓ Tudo certo, gerar"` e `"✎ Alterar dados"`.
- **Barra Inferior de Entrada (Regra de Exclusividade):**
  - Campo de texto + botão de anexo de foto.
  - Se campo vazio: botão de gravação de áudio em destaque (círculo com anel pulsante degradê vermelho). Ao tocar: inicia gravação com timer e botões "Cancelar" e "Enviar Áudio".
  - Se usuário digitar qualquer caractere: botão de microfone é desabilitado/substituído pelo botão de enviar texto (seta para cima).
- **Entrega no Chat:**
  - Player de áudio estilizado com botão play/pause e "Baixar Áudio".
  - Prévia de artes lado a lado (Feed 3:4 e Stories 9:16) com botões individuais de download.

### 3.5 Tela 4 — Editor de Foto de Perfil:
- Upload de foto local com drag & drop.
- Preview central circular (280x280px), alternador P&B vs Colorido, opções de molduras com laço fúnebre e botão `"Salvar Foto de Perfil"`.

### 3.6 Tela 5 — Meu Histórico:
- Lista vertical em cards horizontais estilo pílula com bordas arredondadas e brilho vermelho no item mais recente. Miniatura circular, nome, tipo, data formatada em `America/Sao_Paulo` e ações rápidas de reproduzir/baixar.

### 3.7 Telas 6 e 7 — Sobre o Projeto & Privacidade:
- Cards centralizados translúcidos com tipografia limpa, explicações transparentes sobre o serviço gratuito e exclusão local em 7 dias, além do bloco de doação PIX.

---

## 4. Persistência & Estado (Client-Side)
- `localStorage`:
  - `tutorial_chat_visto`: boolean.
  - `memorial_historico`: lista de itens gerados (áudios e artes).
  - `memorial_session_id`: identificador de sessão local.
