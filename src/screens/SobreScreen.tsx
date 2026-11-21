import React from 'react';
import { ArrowLeft, Shield, Heart, Award, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';

interface SobreScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenPix: () => void;
}

export const SobreScreen: React.FC<SobreScreenProps> = ({ onNavigate, onOpenPix }) => {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in select-none">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16161B]/80 hover:bg-[#1C1C24] border border-white/10 hover:border-red-500/40 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-red-400" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#16161B]/90 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-10 text-center relative overflow-hidden">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-950/50 border border-red-500/40 flex items-center justify-center p-3 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
          <img
            src="/src/assets/dove-red-flower.svg"
            alt="Memorial Solene"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif tracking-tight mb-4">
          Memorial Homenagens & Vinhetas Fúnebres
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Nascemos com o propósito solene de amparar famílias enlutadas, oferecendo dignidade, beleza e reverência na preservação das memórias mais preciosas da vida.
        </p>
      </div>

      {/* Values Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-[#16161B]/60 border border-white/5">
          <Heart className="w-8 h-8 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-white font-serif mb-2">Acolhimento & Respeito</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Cada palavra, acorde musical e detalhe visual é gerado com profundo respeito à dor da despedida.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#16161B]/60 border border-white/5">
          <Shield className="w-8 h-8 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-white font-serif mb-2">Privacidade Total</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Seus dados e fotos pertencem unicamente a você. Não vendemos anúncios nem compartilhamos registros familiares.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#16161B]/60 border border-white/5">
          <Sparkles className="w-8 h-8 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-white font-serif mb-2">Excelência Visual</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Áudio equalizado em estúdio e artes com tipografia nobre para Feed, Stories e fotos de perfil.
          </p>
        </div>
      </div>

      {/* Voluntary Contribution CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1C1C24] to-[#121216] border border-red-500/30 text-center flex flex-col items-center">
        <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mb-2">
          Apoie Nosso Projeto Solene
        </h3>
        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mb-6">
          Mantemos esta ferramenta acessível para todas as famílias através de contribuições voluntárias via PIX. Qualquer valor apoia nossos servidores e novas vozes.
        </p>
        <button
          onClick={onOpenPix}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-semibold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          Fazer Contribuição Voluntária via PIX
        </button>
      </div>
    </div>
  );
};
