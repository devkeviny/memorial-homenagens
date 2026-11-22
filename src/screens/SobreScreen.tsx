import React from 'react';
import { ArrowLeft, Shield, Heart, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';
import BlurText from '../components/BlurText/BlurText';

interface SobreScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenPix: () => void;
}

export const SobreScreen: React.FC<SobreScreenProps> = ({ onNavigate, onOpenPix }) => {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in select-none font-sans">
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

      {/* Hero Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#16161D] border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] mb-10 text-center relative overflow-hidden card-tactile">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-red-950/50 border border-red-500/40 flex items-center justify-center p-3 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] card-tactile">
          <img
            src="/assets/dove-red-flower.svg"
            alt="Memorial Solene"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="mb-4">
          <BlurText
            text="Sobre o Memorial"
            delay={60}
            animateBy="words"
            direction="top"
            className="text-3xl sm:text-5xl font-bold text-white font-sans tracking-tight inline-block"
          />
        </div>
        <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans">
          Nascemos com o propósito solene de amparar famílias enlutadas, oferecendo dignidade, beleza e reverência na preservação das memórias mais preciosas da vida.
        </p>
      </div>

      {/* Values Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-[#16161D] border border-white/5 card-tactile">
          <Heart className="w-8 h-8 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-white font-sans mb-2">Acolhimento & Respeito</h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Cada palavra, acorde musical e detalhe visual é gerado com profundo respeito à dor da despedida.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#16161D] border border-white/5 card-tactile">
          <Shield className="w-8 h-8 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-white font-sans mb-2">Privacidade Total</h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Seus dados e fotos pertencem unicamente a você. Não vendemos anúncios nem compartilhamos registros familiares.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#16161D] border border-white/5 card-tactile">
          <Sparkles className="w-8 h-8 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-white font-sans mb-2">Excelência Visual</h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Áudio equalizado em estúdio e artes com tipografia sans-serif nobre para Feed, Stories e fotos de perfil.
          </p>
        </div>
      </div>

      {/* Voluntary Contribution CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1C1618] to-[#121217] border border-red-500/30 text-center flex flex-col items-center card-tactile">
        <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mb-2">
          Apoie Nosso Projeto Solene
        </h3>
        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mb-6 font-sans">
          Mantemos esta ferramenta acessível para todas as famílias através de contribuições voluntárias via PIX. Qualquer valor apoia nossos servidores e novas vozes.
        </p>
        <button
          onClick={onOpenPix}
          className="px-8 py-3.5 rounded-xl btn-tactile-red text-white font-semibold transition-all cursor-pointer active:scale-95 text-sm sm:text-base font-sans"
        >
          Fazer Contribuição Voluntária via PIX
        </button>
      </div>
    </div>
  );
};
