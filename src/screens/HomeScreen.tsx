import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Image, ArrowRight, ShieldCheck, Heart, Sparkles, Volume2 } from 'lucide-react';
import { ScreenId } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenPix: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenPix }) => {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Top Welcome Solemn Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16161B] border border-red-500/25 text-red-400 text-xs font-medium mb-4 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Homenagens Solenes & Gratuitas</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-serif max-w-2xl mx-auto leading-tight">
          Eternize com respeito quem sempre viverá no seu coração.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Criação de vinhetas fúnebres faladas em áudio e artes comemorativas em alta definição para familiares e redes sociais.
        </p>
      </motion.div>

      {/* 2 Bento Cards with Red Gradient Glow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
        {/* Bento Card 1: Criar Vinheta em Áudio */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('chat')}
          className="relative group flex flex-col justify-between p-8 sm:p-10 rounded-[24px] bg-[#16161B]/90 border border-red-500/30 hover:border-red-500/60 shadow-[0_0_30px_rgba(220,38,38,0.2)] hover:shadow-[0_0_45px_rgba(220,38,38,0.4)] transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle decorative glow element */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-red-600/10 filter blur-3xl pointer-events-none group-hover:bg-red-600/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-900 to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                Mais Solicitado
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-3">
              Criar Vinheta em Áudio
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
              Gere uma vinheta fúnebre narrada com fundo musical solene, dados do velório e sepultamento pronta para envio no WhatsApp da família.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-red-400" />
              Voz solene com música de fundo
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
              <span>Iniciar</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Bento Card 2: Artes e Foto de Perfil */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('artes-submenu')}
          className="relative group flex flex-col justify-between p-8 sm:p-10 rounded-[24px] bg-[#16161B]/90 border border-white/10 hover:border-red-500/50 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-red-700/10 filter blur-3xl pointer-events-none group-hover:bg-red-700/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#23232C] border border-white/10 shadow-lg group-hover:scale-110 group-hover:border-red-500/40 transition-all">
                <Image className="w-7 h-7 text-red-400" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-zinc-300 border border-white/10">
                Feed, Stories & Perfil
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-3">
              Artes e Foto de Perfil
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
              Crie posts de luto formatados para Feed 3:4 e Stories 9:16 ou adicione molduras solenes com laço preto e efeito preto e branco para foto de perfil.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <span className="text-xs font-medium text-zinc-400">
              Download em alta definição (PNG)
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
              <span>Explorar</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust & Reassurance Ribbon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#121217] border border-white/5 text-xs text-zinc-400"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Totalmente gratuito • Não requer cadastro • Privacidade garantida</span>
        </div>
        <button
          onClick={onOpenPix}
          className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400/30" />
          <span>Gostou do projeto? Apoie via PIX</span>
        </button>
      </motion.div>
    </div>
  );
};
