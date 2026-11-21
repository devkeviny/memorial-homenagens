import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Radio, Image as ImageIcon, Sparkle, UserCheck } from 'lucide-react';
import { ScreenId } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenPix: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenPix }) => {
  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-80px)] justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto animate-fadeIn select-none font-sans">
      {/* Top Welcome Solemn Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161D] border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide mb-3 card-tactile shadow-[0_0_15px_rgba(220,38,38,0.15)] font-sans">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Homenagens Solenes & Acolhimento Gratuito</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight font-sans">
          Eternize com respeito quem sempre viverá no seu coração
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-sans">
          Criação de vinhetas em áudio com voz solene e artes comemorativas em alta definição para familiares e redes sociais.
        </p>
      </motion.div>

      {/* 2 Bento Cards Split 50/50 (Ocupa a tela inteira com degradê vermelho solene) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 flex-1 items-stretch my-2">
        {/* Bento Card 1: Chat Único e Unificado (Vinheta + Artes Integradas) */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('chat')}
          className="relative group flex flex-col justify-between p-7 sm:p-10 rounded-[32px] bg-gradient-to-b from-[#181822] to-[#101015] border border-red-500/40 hover:border-red-500/70 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_30px_rgba(220,38,38,0.25)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_40px_rgba(220,38,38,0.4)] transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento"
        >
          {/* Subtle bottom solemn red gradient accent */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-red-950/40 via-red-900/10 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/20 transition-all" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 text-white shadow-[0_4px_16px_rgba(220,38,38,0.45)] group-hover:scale-105 transition-transform">
                <Radio className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-red-500/15 text-red-300 border border-red-500/30 font-sans">
                Chat Unificado • Áudio & Artes
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight font-sans">
              Homenagem Completa via Chat
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mb-4">
              Um único chat solene e acolhedor que produz em conjunto a vinheta narrada em áudio para WhatsApp e as artes comemorativas prontas para Feed (3:4) e Stories (9:16).
            </p>

            <div className="space-y-2 text-xs sm:text-sm text-zinc-400 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Vinheta em áudio masterizada com voz solene e trilha orquestrada</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Artes visuais em alta resolução (Feed 3:4 e Stories 9:16)</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 font-sans">
              <Sparkle className="w-4 h-4 text-red-400" />
              <span>Gera áudio e imagens de uma só vez</span>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white btn-tactile-red flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] font-sans"
            >
              <span>Iniciar Homenagem</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Bento Card 2: Foto de Perfil & Molduras de Luto */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('editor-perfil')}
          className="relative group flex flex-col justify-between p-7 sm:p-10 rounded-[32px] bg-gradient-to-b from-[#181822] to-[#101015] border border-white/10 hover:border-red-500/50 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_35px_rgba(220,38,38,0.3)] transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento"
        >
          {/* Subtle bottom solemn red gradient accent */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-red-950/30 via-zinc-900/10 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none group-hover:bg-red-700/15 transition-all" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#22222C] border border-white/10 text-red-400 shadow-[0_4px_16px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:border-red-500/40 transition-all">
                <UserCheck className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/5 text-zinc-300 border border-white/10 font-sans">
                WhatsApp & Redes
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight font-sans">
              Foto de Perfil (Luto)
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mb-4">
              Aplique moldura circular com laço preto oficial de respeito, converta sua foto para preto e branco e faça o enquadramento perfeito com gestos de toque e pinça.
            </p>

            <div className="space-y-2 text-xs sm:text-sm text-zinc-400 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Laço solene oficial com efeito preto e branco automático</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Zoom e reposicionamento com pinça touch em celulares</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 font-sans">
              <ImageIcon className="w-4 h-4 text-zinc-400" />
              <span>Download imediato em alta resolução (PNG)</span>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white btn-tactile flex items-center justify-center gap-2 group-hover:text-red-400 font-sans"
            >
              <span>Editar Foto</span>
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
        className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#14141A] border border-white/10 text-xs text-zinc-400 mt-6 card-tactile font-sans"
      >
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Privacidade total: seus dados e homenagens ficam salvos no seu próprio navegador.</span>
        </div>

        <button
          onClick={onOpenPix}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white btn-tactile transition-colors font-sans"
        >
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/40" />
          <span>Apoiar Projeto</span>
        </button>
      </motion.div>
    </div>
  );
};
