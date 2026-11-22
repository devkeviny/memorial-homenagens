import React from 'react';
import { motion } from 'framer-motion';
import { Radio, ImageIcon, ArrowRight, CheckCircle2, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';
import BlurText from '../components/BlurText/BlurText';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
  onOpenPix: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenPix }) => {
  return (
    <div className="flex-1 flex flex-col justify-between w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 animate-fade-in font-sans">
      {/* 50/50 Large Bento Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 flex-1 items-stretch">
        {/* Bento Card 1: Criar Vinheta em Áudio */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('chat')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('chat');
          }}
          className="relative group flex flex-col justify-between p-7 sm:p-10 md:p-12 rounded-[32px] bg-gradient-to-b from-[#181822] via-[#121218] to-[#0D0D12] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento card-dynamic-solemn"
        >
          {/* Background fotográfico com rosas vermelhas em cor seletiva */}
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
                <Radio className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm sm:text-base font-cursive text-red-300 italic tracking-wider">
                Voz Solene & Oração
              </span>
            </div>

            <div className="mb-4">
              <BlurText
                text="Criar Vinheta em Áudio"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed font-sans mb-6">
              Produza uma vinheta narrada com voz solene, trilha orquestrada de acolhimento e dados da despedida para homenagear e compartilhar com carinho no WhatsApp.
            </p>

            <div className="space-y-3 text-sm sm:text-base text-zinc-300 font-sans">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Voz solene com trilha orquestrada de acolhimento</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Áudio masterizado pronto para compartilhar no WhatsApp</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Assistente guiado por voz ou digitação respeitosa</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 font-sans">
              <Sparkles className="w-4 h-4 text-zinc-400" />
              <span>Geração imediata no Chat Solene</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('chat');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-zinc-950 btn-tactile-white flex items-center justify-center gap-2 font-sans cursor-pointer"
            >
              <span>Criar Vinheta</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Bento Card 2: Criar Postagens (Leva para a página de postagens) */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('artes-submenu')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('artes-submenu');
          }}
          className="relative group flex flex-col justify-between p-7 sm:p-10 md:p-12 rounded-[32px] bg-gradient-to-b from-[#181822] via-[#121218] to-[#0D0D12] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(255,255,255,0.06)] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento card-dynamic-solemn"
        >
          {/* Background fotográfico com rosas vermelhas em cor seletiva */}
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
                <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="text-sm sm:text-base font-cursive text-zinc-300 italic tracking-wider">
                Luto & Saudade Eterna
              </span>
            </div>

            <div className="mb-4">
              <BlurText
                text="Criar Postagens"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed font-sans mb-6">
              Molduras com laço oficial de luto para foto de perfil do WhatsApp e postagens comemorativas em alta resolução para Feed (3:4) e Stories (9:16).
            </p>

            <div className="space-y-3 text-sm sm:text-base text-zinc-300 font-sans">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Moldura de luto para WhatsApp com laço preto oficial</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Postagens comemorativas em alta definição para Feed e Stories</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-zinc-300 flex-shrink-0" />
                <span>Editor com pinça touch e download imediato em PNG</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 font-sans">
              <ImageIcon className="w-4 h-4 text-zinc-400" />
              <span>Download imediato e gratuito em PNG</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('artes-submenu');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-zinc-950 btn-tactile-white flex items-center justify-center gap-2 font-sans cursor-pointer"
            >
              <span>Criar Postagens</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust & Reassurance Ribbon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#14141A] border border-white/10 text-xs text-zinc-400 mt-4 card-tactile font-sans"
      >
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Privacidade total: seus dados e homenagens ficam salvos no seu próprio navegador.</span>
        </div>

        <button
          onClick={onOpenPix}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white btn-tactile transition-colors font-sans"
        >
          <Heart className="w-3.5 h-3.5 text-zinc-400" />
          <span>Apoiar Projeto</span>
        </button>
      </motion.div>
    </div>
  );
};
