import React from 'react';
import { motion } from 'framer-motion';
import { Radio, ImageIcon, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { ScreenId } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
  onOpenPix: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenPix }) => {
  return (
    <div className="flex-1 flex flex-col justify-between w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-8 font-sans md:h-screen md:max-h-screen md:overflow-hidden overflow-y-auto scrollbar-none">
      {/* 50/50 Large Bento Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 flex-1 items-stretch my-auto">
        {/* Bento Card 1: Criar Vinheta em Áudio */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('chat')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('chat');
          }}
          className="relative group flex flex-col justify-between p-6 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-[32px] border border-hairline shadow-md hover:border-zinc-400 dark:hover:border-white/20 transition-all duration-200 cursor-pointer overflow-hidden card-tactile-bento"
        >
          {/* Subtle background art with quiet opacity */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 group-hover:opacity-15 dark:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_vinheta_bg.webp')` }}
          />
          {/* Quiet gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/30 pointer-events-none" />

          {/* Content: Strict Quiet Chrome (Icon + Direct Title + 1-line Subtitle) */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-elevated border border-hairline text-primary shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Radio className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary font-sans transition-opacity duration-200">
              Criar Vinheta
            </h2>
            <p className="mt-2 text-sm sm:text-base text-secondary leading-relaxed font-sans">
              Vinheta narrada com voz solene e trilha orquestrada para WhatsApp.
            </p>
          </div>

          {/* Action Row */}
          <div className="relative z-10 pt-4 sm:pt-6 mt-4 border-t border-hairline flex items-center justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('chat');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-tactile-white flex items-center justify-center gap-2 font-sans cursor-pointer"
            >
              <span>Criar Vinheta</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Bento Card 2: Criar Postagens */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('artes-submenu')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('artes-submenu');
          }}
          className="relative group flex flex-col justify-between p-6 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-[32px] border border-hairline shadow-md hover:border-zinc-400 dark:hover:border-white/20 transition-all duration-200 cursor-pointer overflow-hidden card-tactile-bento"
        >
          {/* Subtle background art with quiet opacity */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 group-hover:opacity-15 dark:group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_artes_bg.webp')` }}
          />
          {/* Quiet gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/30 pointer-events-none" />

          {/* Content: Strict Quiet Chrome (Icon + Direct Title + 1-line Subtitle) */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-elevated border border-hairline text-primary shadow-sm group-hover:scale-105 transition-transform duration-200">
                <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary font-sans transition-opacity duration-200">
              Criar Postagens
            </h2>
            <p className="mt-2 text-sm sm:text-base text-secondary leading-relaxed font-sans">
              Molduras de luto para Feed, Stories e foto de perfil.
            </p>
          </div>

          {/* Action Row */}
          <div className="relative z-10 pt-4 sm:pt-6 mt-4 border-t border-hairline flex items-center justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('artes-submenu');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-tactile-white flex items-center justify-center gap-2 font-sans cursor-pointer"
            >
              <span>Criar Postagens</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust & Reassurance Ribbon (Quiet and compact) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-surface border border-hairline text-xs text-secondary mt-3 sm:mt-4 card-tactile font-sans">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Privacidade total: seus dados e homenagens ficam salvos no seu próprio navegador.</span>
        </div>

        <button
          onClick={onOpenPix}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-secondary hover:text-primary btn-tactile transition-colors font-sans"
        >
          <Heart className="w-3.5 h-3.5 text-accent-wine" />
          <span>Apoiar Projeto</span>
        </button>
      </div>
    </div>
  );
};
