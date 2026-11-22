import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, LayoutGrid, ArrowRight, Sparkles, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { ScreenId } from '../types';
import BlurText from '../components/BlurText/BlurText';

interface ArtesSubmenuScreenProps {
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
}

export const ArtesSubmenuScreen: React.FC<ArtesSubmenuScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col justify-between w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 animate-fade-in font-sans">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-tactile text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer font-sans"
        >
          <ArrowLeft className="w-4 h-4 text-red-400" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16161B] border border-white/10 text-zinc-300 text-xs font-semibold mb-4 shadow-sm font-sans">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>Artes em Alta Definição</span>
        </div>

        <div className="mb-3">
          <BlurText
            text="Escolha o formato da sua homenagem"
            delay={60}
            animateBy="words"
            direction="top"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans inline-block"
          />
        </div>
        <p className="mt-2 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed font-sans">
          Gere molduras de luto para sua foto de perfil ou crie publicações completas para Feed e Stories.
        </p>
      </motion.div>

      {/* 50/50 Large Bento Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 flex-1 items-stretch mb-8">
        {/* Bento Card 1: Foto de Perfil (Luto) */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('editor-perfil')}
          className="relative group flex flex-col justify-between p-7 sm:p-10 md:p-12 rounded-[32px] bg-gradient-to-b from-[#181822] via-[#121218] to-[#0D0D12] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento card-dynamic-solemn"
        >
          {/* Background fotográfico solene com rosas/vela em sobreposição escura */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_vinheta_bg.webp')` }}
          />
          {/* Gradiente vermelho pulsando internamente no card por cima da imagem (glow discreto) */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/15 via-red-900/10 to-transparent pointer-events-none animate-pulse-glow" />
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#22222C] border border-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:border-white/20 transition-all">
                <User className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm sm:text-base font-cursive text-zinc-300 italic tracking-wider">
                WhatsApp & Redes
              </span>
            </div>

            <div className="mb-4">
              <BlurText
                text="Foto de Perfil (Luto)"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed font-sans mb-6">
              Aplique moldura circular com laço preto oficial de luto, converta sua foto em preto e branco e faça o download pronto para seu perfil no WhatsApp e Instagram.
            </p>

            <div className="space-y-3 text-sm sm:text-base text-zinc-300 font-sans">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Moldura de luto com laço preto oficial e respeito solene</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Filtro P&B e sépia com ajuste fino de contraste</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Enquadramento por toque e download direto em PNG</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 font-sans">
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span>Efeito P&B + Molduras</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('chat');
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/50 border border-red-500/40 text-xs font-semibold text-red-300 hover:bg-red-900/60 transition-colors"
                title="Editar homenagem com Inteligência Artificial"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Editar com IA</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold uppercase tracking-wider">Novo</span>
              </button>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-zinc-950 btn-tactile-white flex items-center justify-center gap-2 font-sans"
            >
              <span>Criar agora</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Bento Card 2: Templates Oficiais (Feed & Stories) */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('templates-artes')}
          className="relative group flex flex-col justify-between p-7 sm:p-10 md:p-12 rounded-[32px] bg-gradient-to-b from-[#181822] via-[#121218] to-[#0D0D12] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(255,255,255,0.06)] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento card-dynamic-solemn"
        >
          {/* Background fotográfico solene com flores/velas */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_artes_bg.webp')` }}
          />
          {/* Gradiente vermelho pulsando internamente no card por cima da imagem (glow discreto) */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/15 via-red-900/10 to-transparent pointer-events-none animate-pulse-glow" />
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#22222C] border border-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:border-white/20 transition-all">
                <LayoutGrid className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm sm:text-base font-cursive text-zinc-300 italic tracking-wider">
                Galeria de Templates
              </span>
            </div>

            <div className="mb-4">
              <BlurText
                text="Templates Oficiais (Feed & Stories)"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed font-sans mb-6">
              Acesse a galeria com templates nobres prontos. Preencha os dados do homenageado, enquadre a foto com gestos de toque na tela e baixe em alta resolução diretamente.
            </p>

            <div className="space-y-3 text-sm sm:text-base text-zinc-300 font-sans">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Formatos otimizados para Feed (3:4) e Stories (9:16)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Tipografia nobre, filetes dourados e acentos escarlate</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Exportação instantânea em alta definição PNG</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 font-sans">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <span>Feed 3:4 & Stories 9:16</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('chat');
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/50 border border-red-500/40 text-xs font-semibold text-red-300 hover:bg-red-900/60 transition-colors"
                title="Editar homenagem com Inteligência Artificial"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Editar com IA</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold uppercase tracking-wider">Novo</span>
              </button>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-zinc-950 btn-tactile-white flex items-center justify-center gap-2 font-sans"
            >
              <span>Criar agora</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
