import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, ImageIcon, ArrowRight } from 'lucide-react';
import { ScreenId } from '../types';

interface ArtesSubmenuScreenProps {
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
}

export const ArtesSubmenuScreen: React.FC<ArtesSubmenuScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col justify-between w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-8 font-sans md:h-screen md:max-h-screen md:overflow-hidden overflow-y-auto scrollbar-none">
      {/* Top Header Row with Back Button */}
      <div className="shrink-0 mb-3 sm:mb-4">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl btn-tactile text-xs sm:text-sm font-medium text-secondary hover:text-primary transition-all active:scale-95 cursor-pointer font-sans"
        >
          <ArrowLeft className="w-4 h-4 text-accent-wine" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* Screen Title & Context */}
      <div className="text-center shrink-0 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary font-sans">
          Escolha o formato da sua homenagem
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-secondary max-w-xl mx-auto leading-relaxed font-sans">
          Molduras de luto para foto de perfil e modelos dedicados para Feed e Stories.
        </p>
      </div>

      {/* 50/50 Large Bento Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 flex-1 items-stretch my-auto">
        {/* Bento Card 1: Foto de Perfil (Luto) */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('editor-perfil')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('editor-perfil');
          }}
          className="relative group flex flex-col justify-between p-6 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-[32px] border border-hairline shadow-md hover:border-zinc-400 dark:hover:border-white/20 transition-all duration-200 cursor-pointer overflow-hidden card-tactile-bento"
        >
          {/* Background art */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 group-hover:opacity-15 dark:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_vinheta_bg.webp')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/30 pointer-events-none" />

          {/* Strict Quiet Chrome (Icon + Title + 1-line Subtitle) */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-elevated border border-hairline text-primary shadow-sm group-hover:scale-105 transition-transform duration-200">
                <User className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary font-sans transition-opacity duration-200">
              Foto de Perfil
            </h2>
            <p className="mt-2 text-sm sm:text-base text-secondary leading-relaxed font-sans">
              Moldura circular com laço preto oficial de luto para WhatsApp e redes.
            </p>
          </div>

          {/* Action Row */}
          <div className="relative z-10 pt-4 sm:pt-6 mt-4 border-t border-hairline flex items-center justify-end">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-tactile-white flex items-center justify-center gap-2 font-sans"
            >
              <span>Criar Foto</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Bento Card 2: Templates Oficiais (Feed & Stories) */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('templates-artes')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('templates-artes');
          }}
          className="relative group flex flex-col justify-between p-6 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-[32px] border border-hairline shadow-md hover:border-zinc-400 dark:hover:border-white/20 transition-all duration-200 cursor-pointer overflow-hidden card-tactile-bento"
        >
          {/* Background art */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 group-hover:opacity-15 dark:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_artes_bg.webp')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/30 pointer-events-none" />

          {/* Strict Quiet Chrome (Icon + Title + 1-line Subtitle) */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-elevated border border-hairline text-primary shadow-sm group-hover:scale-105 transition-transform duration-200">
                <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary font-sans transition-opacity duration-200">
              Modelos Solenes
            </h2>
            <p className="mt-2 text-sm sm:text-base text-secondary leading-relaxed font-sans">
              Modelos em 3:4 e 9:16 com foto, datas e mensagens de homenagem.
            </p>
          </div>

          {/* Action Row */}
          <div className="relative z-10 pt-4 sm:pt-6 mt-4 border-t border-hairline flex items-center justify-end">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-tactile-white flex items-center justify-center gap-2 font-sans"
            >
              <span>Ver Modelos</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
