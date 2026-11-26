import React from 'react';
import { ArrowLeft, Shield, Heart, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-tactile text-xs sm:text-sm font-medium text-secondary hover:text-primary transition-all active:scale-95 cursor-pointer font-sans"
        >
          <ArrowLeft className="w-4 h-4 text-accent-wine" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-hairline shadow-md mb-8 text-center relative overflow-hidden card-tactile">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-elevated border border-hairline flex items-center justify-center p-3 mb-6 shadow-sm">
          <img
            src="/assets/dove-red-flower.svg"
            alt="Memorial Solene"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-primary font-sans tracking-tight mb-3">
          Sobre o Memorial
        </h1>
        <p className="text-sm sm:text-base text-secondary max-w-2xl mx-auto leading-relaxed font-sans">
          Nascemos com o propósito solene de amparar famílias enlutadas, oferecendo dignidade, beleza e reverência na preservação das memórias mais preciosas da vida.
        </p>
      </div>

      {/* Values Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="p-6 rounded-2xl bg-surface border border-hairline card-tactile">
          <Heart className="w-7 h-7 text-accent-wine mb-3" />
          <h2 className="text-base font-bold text-primary font-sans mb-1.5">Acolhimento & Respeito</h2>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans">
            Cada palavra, acorde musical e detalhe visual é gerado com profundo respeito à dor da despedida.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-hairline card-tactile">
          <Shield className="w-7 h-7 text-accent-wine mb-3" />
          <h2 className="text-base font-bold text-primary font-sans mb-1.5">Privacidade Total</h2>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans">
            Seus dados e fotos pertencem unicamente a você. Não vendemos anúncios nem compartilhamos registros familiares.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-hairline card-tactile">
          <Sparkles className="w-7 h-7 text-accent-wine mb-3" />
          <h2 className="text-base font-bold text-primary font-sans mb-1.5">Excelência Visual</h2>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans">
            Áudio equalizado em estúdio e artes com tipografia nobre para Feed, Stories e fotos de perfil.
          </p>
        </div>
      </div>

      {/* Voluntary Contribution CTA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-elevated border border-hairline text-center flex flex-col items-center card-tactile">
        <h2 className="text-lg sm:text-xl font-bold text-primary font-sans mb-2">
          Apoie Nosso Projeto Solene
        </h2>
        <p className="text-xs sm:text-sm text-secondary max-w-lg mb-5 font-sans">
          Mantemos esta ferramenta acessível para todas as famílias através de contribuições voluntárias via PIX. Qualquer valor apoia nossos servidores e novas vozes.
        </p>
        <button
          onClick={onOpenPix}
          className="px-6 py-3 rounded-xl btn-tactile-white font-semibold transition-all cursor-pointer active:scale-95 text-xs sm:text-sm font-sans"
        >
          Fazer Contribuição Voluntária via PIX
        </button>
      </div>
    </div>
  );
};
