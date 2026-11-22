import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, LayoutGrid, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ScreenId } from '../types';

interface ArtesSubmenuScreenProps {
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
}

export const ArtesSubmenuScreen: React.FC<ArtesSubmenuScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in font-sans">
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
        className="text-center mb-10 sm:mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16161B] border border-white/10 text-zinc-300 text-xs font-semibold mb-4 shadow-sm font-sans">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>Artes em Alta Definição</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans max-w-2xl mx-auto leading-tight">
          Escolha o formato da sua homenagem
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed font-sans">
          Gere molduras de luto para sua foto de perfil ou crie publicações completas para Feed e Stories.
        </p>
      </motion.div>

      {/* Bento Grid with 2 Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
        {/* Card A: Foto de Perfil (Luto) */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('editor-perfil')}
          className="relative group flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#16161D] border border-white/10 hover:border-white/20 shadow-[0_4px_25px_rgba(0,0,0,0.6)] card-tactile transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/5 filter blur-3xl pointer-events-none transition-all" />

          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#22222C] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform card-tactile">
                <User className="w-7 h-7 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-zinc-300 border border-white/10 font-sans">
                WhatsApp & Redes
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans mb-3">
              Foto de Perfil (Luto)
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 font-sans">
              Aplique moldura circular com laço preto oficial de luto, converta sua foto em preto e branco e faça o download pronto para seu perfil no WhatsApp e Instagram.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <span className="text-xs font-medium text-zinc-400 font-sans">
              Efeito P&B + Molduras Solenes
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors font-sans">
              <span>Personalizar</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Card B: Post Duplo (Feed 3:4 + Stories 9:16) */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('chat', 'artes')}
          className="relative group flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#1C1618] via-[#16161D] to-[#121217] border border-white/10 hover:border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)] card-tactile transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/5 filter blur-3xl pointer-events-none transition-all" />

          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#22222C] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform card-tactile">
                <LayoutGrid className="w-7 h-7 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-zinc-300 border border-white/10 font-sans">
                Combo 2 em 1
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans mb-3">
              Post Duplo (Feed & Stories)
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 font-sans">
              Nossa inteligência cria simultaneamente a arte vertical de Stories (9:16) e a arte de Feed (3:4) com nome, datas, mensagem e dados da cerimônia.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 font-sans">
              <ImageIcon className="w-4 h-4 text-zinc-400" />
              Gera Feed 3:4 e Stories 9:16
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors font-sans">
              <span>Criar via Chat</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
