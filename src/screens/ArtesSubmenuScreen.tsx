import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, LayoutGrid, ArrowRight, MessageSquare, Image as ImageIcon, CheckCircle2, Layers } from 'lucide-react';
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
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>Modelos para Redes Sociais</span>
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
          Molduras de luto para foto de perfil e modelos dedicados para Feed e Stories.
        </p>
      </motion.div>

      {/* 50/50 Large Bento Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 flex-1 items-stretch mb-8">
        {/* Bento Card 1: Foto de Perfil (Luto) */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('editor-perfil')}
          className="relative group flex flex-col justify-between p-6 sm:p-8 md:p-10 rounded-[32px] bg-gradient-to-b from-[#14141B] via-[#0E0E14] to-[#0A0A0E] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.03)] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento card-dynamic-solemn"
        >
          {/* Background fotográfico mais escuro com opacidade contida */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_vinheta_bg.webp')` }}
          />
          {/* Degradê vertical elegante de cima para baixo (do escuro profundo ao transparente/suave) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0E]/90 via-[#0A0A0E]/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1C1C24] border border-white/10 text-white shadow-md group-hover:scale-105 transition-all">
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-200" />
              </div>
              <span className="text-xs sm:text-sm font-cursive text-zinc-400 italic tracking-wider">
                WhatsApp & Redes
              </span>
            </div>

            <div className="mb-3">
              <BlurText
                text="Foto de Perfil (Luto)"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mb-4">
              Moldura circular com laço preto oficial de luto e conversão em preto e branco para o perfil.
            </p>
          </div>

          <div className="relative z-10 pt-5 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Molduras de respeito</span>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-950 btn-tactile-white flex items-center justify-center gap-2 font-sans"
            >
              <span>Criar foto</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Bento Card 2: Templates Oficiais (Feed & Stories) */}
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('templates-artes')}
          className="relative group flex flex-col justify-between p-6 sm:p-8 md:p-10 rounded-[32px] bg-gradient-to-b from-[#14141B] via-[#0E0E14] to-[#0A0A0E] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.03)] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento card-dynamic-solemn"
        >
          {/* Background fotográfico mais escuro com opacidade contida */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_artes_bg.webp')` }}
          />
          {/* Degradê vertical elegante de cima para baixo (do escuro profundo ao transparente/suave) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0E]/90 via-[#0A0A0E]/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1C1C24] border border-white/10 text-white shadow-md group-hover:scale-105 transition-all">
                <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-200" />
              </div>
              <span className="text-xs sm:text-sm font-cursive text-zinc-400 italic tracking-wider">
                Feed 3:4 & Stories 9:16
              </span>
            </div>

            <div className="mb-3">
              <BlurText
                text="Modelos Solenes"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mb-4">
              Modelos comemorativos com foto, datas e mensagens para compartilhar com familiares e amigos.
            </p>
          </div>

          <div className="relative z-10 pt-5 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Formatos Feed e Stories</span>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-950 btn-tactile-white flex items-center justify-center gap-2 font-sans"
            >
              <span>Ver modelos</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
