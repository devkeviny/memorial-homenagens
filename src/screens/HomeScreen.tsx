import React from 'react';
import { motion } from 'framer-motion';
import { Radio, ImageIcon, ArrowRight, CheckCircle2, ShieldCheck, Heart, RadioTower, Layers } from 'lucide-react';
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
          className="relative group flex flex-col justify-between p-6 sm:p-8 md:p-10 rounded-[32px] bg-gradient-to-b from-[#14141B] via-[#0E0E14] to-[#0A0A0E] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.03)] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento card-dynamic-solemn"
        >
          {/* Background fotográfico mais escuro com opacidade contida */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_vinheta_bg.webp')` }}
          />
          {/* Degradê vertical elegante de cima para baixo (do escuro profundo ao transparente/suave) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0E]/90 via-[#0A0A0E]/50 to-transparent pointer-events-none" />
          {/* Brilho avermelhado discreto e solene no fundo */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1C1C24] border border-white/10 text-white shadow-md group-hover:scale-105 transition-all">
                <Radio className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-200" />
              </div>
              <span className="text-xs sm:text-sm font-cursive text-zinc-400 italic tracking-wider">
                Voz Solene & Oração
              </span>
            </div>

            <div className="mb-3">
              <BlurText
                text="Criar Vinheta em Áudio"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mb-4">
              Vinheta narrada com voz solene e trilha orquestrada, pronta para compartilhar com a família no WhatsApp.
            </p>
          </div>

          <div className="relative z-10 pt-5 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
              <RadioTower className="w-3.5 h-3.5 text-zinc-400" />
              <span>Geração direta no chat</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('chat');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-950 btn-tactile-white flex items-center justify-center gap-2 font-sans cursor-pointer"
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
          className="relative group flex flex-col justify-between p-6 sm:p-8 md:p-10 rounded-[32px] bg-gradient-to-b from-[#14141B] via-[#0E0E14] to-[#0A0A0E] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.03)] hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden card-tactile-bento card-dynamic-solemn"
        >
          {/* Background fotográfico mais escuro com opacidade contida */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundImage: `url('/assets/card_artes_bg.webp')` }}
          />
          {/* Degradê vertical elegante de cima para baixo (do escuro profundo ao transparente/suave) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0E]/90 via-[#0A0A0E]/50 to-transparent pointer-events-none" />
          {/* Brilho avermelhado discreto e solene no fundo */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1C1C24] border border-white/10 text-white shadow-md group-hover:scale-105 transition-all">
                <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-200" />
              </div>
              <span className="text-xs sm:text-sm font-cursive text-zinc-400 italic tracking-wider">
                Luto & Saudade Eterna
              </span>
            </div>

            <div className="mb-3">
              <BlurText
                text="Criar Postagens"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mb-4">
              Molduras para WhatsApp e publicações de luto dedicadas para Feed e Stories.
            </p>
          </div>

          <div className="relative z-10 pt-5 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Formatos Feed, Stories e Perfil</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('artes-submenu');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-950 btn-tactile-white flex items-center justify-center gap-2 font-sans cursor-pointer"
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
