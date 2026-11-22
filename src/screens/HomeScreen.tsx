import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Radio, Image as ImageIcon, Sparkle, ShieldCheck, Heart } from 'lucide-react';
import { ScreenId } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
  onOpenPix: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenPix }) => {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] md:h-screen p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn select-none font-sans overflow-hidden">
      {/* 2 Bento Cards Split 50/50 Desktop Full-Height & Full-Screen Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0 items-stretch">
        {/* Bento Card 1: Criar Vinheta em Áudio (leva para o Chat) */}
        <motion.div
          whileHover={{ scale: 1.008 }}
          whileTap={{ scale: 0.992 }}
          onClick={() => onNavigate('chat', 'vinheta')}
          className="relative group flex flex-col justify-between p-6 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-[#181822] via-[#121218] to-[#0D0D12] border border-red-500/40 shadow-[0_15px_35px_rgba(0,0,0,0.7)] transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento animate-solemn-card-1"
        >
          {/* Continuous Autonomous Dynamic Gradient Pulse at bottom & borders */}
          <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-red-950/60 via-red-900/25 to-transparent pointer-events-none animate-solemn-base-gradient" />
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-solemn-backdrop" />

          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-13 h-13 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-600 to-red-900 text-white shadow-[0_6px_20px_rgba(220,38,38,0.5)] group-hover:scale-105 transition-transform">
                <Radio className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase bg-red-500/15 text-red-300 border border-red-500/30 font-sans shadow-sm">
                Assistente Solene • Áudio
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 sm:mb-4 tracking-tight font-sans">
              Criar Vinheta em Áudio
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed font-sans mb-4 sm:mb-6">
              Produza uma vinheta solene narrada com fundo musical orquestrado e acolhimento pelo Assistente Solene. Perfeito para partilhar no WhatsApp com amigos e familiares.
            </p>

            <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-zinc-400 font-sans mt-auto">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>Narração solene com trilha orquestrada e tom respeitoso</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>Interação por voz ou texto no Chat Único Solene</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 font-sans">
              <Sparkle className="w-4 h-4 text-red-400" />
              <span>Download gratuito em áudio WAV</span>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white btn-tactile-red flex items-center justify-center gap-2 font-sans shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-all cursor-pointer"
            >
              <span>Abrir no Chat</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Bento Card 2: Criar Artes (leva para o submenu/página de artes) */}
        <motion.div
          whileHover={{ scale: 1.008 }}
          whileTap={{ scale: 0.992 }}
          onClick={() => onNavigate('artes-submenu')}
          className="relative group flex flex-col justify-between p-6 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-[#181822] via-[#121218] to-[#0D0D12] border border-red-500/40 shadow-[0_15px_35px_rgba(0,0,0,0.7)] transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento animate-solemn-card-2"
        >
          {/* Continuous Autonomous Dynamic Gradient Pulse at bottom & borders */}
          <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-red-950/50 via-zinc-900/30 to-transparent pointer-events-none animate-solemn-base-gradient-alt" />
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-red-800/15 rounded-full blur-3xl pointer-events-none animate-solemn-backdrop" />

          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-13 h-13 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#242432] to-[#16161D] border border-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:border-red-500/40 transition-all">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase bg-white/5 text-zinc-300 border border-white/10 font-sans shadow-sm">
                Redes & Perfil • Formatos
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 sm:mb-4 tracking-tight font-sans">
              Criar Artes
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed font-sans mb-4 sm:mb-6">
              Escolha entre o editor de Foto de Perfil com laço oficial de luto em preto e branco ou o gerador de artes completas para Feed (3:4) e Stories (9:16).
            </p>

            <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-zinc-400 font-sans mt-auto">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>Foto de Perfil com laço de luto e gestos de pinça touch</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>Post Duplo em alta definição (Feed 3:4 e Stories 9:16)</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 font-sans">
              <ImageIcon className="w-4 h-4 text-zinc-400" />
              <span>Submenu e opções de formatos</span>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white btn-tactile flex items-center justify-center gap-2 font-sans group-hover:text-red-400 group-hover:border-red-500/40 transition-all cursor-pointer"
            >
              <span>Ver Opções</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust & Reassurance Ribbon (Compact Footer) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-[#14141A]/90 border border-white/10 text-xs text-zinc-400 mt-3 card-tactile font-sans shrink-0">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Privacidade total: suas homenagens são processadas no seu próprio navegador.</span>
        </div>

        <button
          onClick={onOpenPix}
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white btn-tactile transition-colors font-sans cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/40" />
          <span>Apoiar Projeto</span>
        </button>
      </div>
    </div>
  );
};
