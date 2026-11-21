import React from 'react';
import { ArrowLeft, Lock, EyeOff, Database } from 'lucide-react';
import { ScreenId } from '../types';

interface PrivacidadeScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PrivacidadeScreen: React.FC<PrivacidadeScreenProps> = ({ onNavigate }) => {
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white font-sans tracking-tight">
          Termos de Privacidade & Proteção de Dados
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 font-sans">
          Entenda como tratamos com máxima reverência e discrição as memórias do seu ente querido.
        </p>
      </div>

      {/* Content Cards */}
      <div className="space-y-6 text-zinc-300 text-sm sm:text-base leading-relaxed">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#16161D] border border-white/10 card-tactile">
          <div className="flex items-center gap-3 mb-4 text-red-400 font-bold font-sans text-lg">
            <Lock className="w-5 h-5" />
            <span>1. Armazenamento Local no Dispositivo</span>
          </div>
          <p className="font-sans">
            Suas criações (fotos de perfil, artes de feed e stories, e histórico) são processadas e gravadas no armazenamento seguro do seu próprio navegador (LocalStorage / Cache local). Você tem total controle para excluir seu histórico a qualquer momento com um único clique.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#16161D] border border-white/10 card-tactile">
          <div className="flex items-center gap-3 mb-4 text-red-400 font-bold font-sans text-lg">
            <EyeOff className="w-5 h-5" />
            <span>2. Não Comercialização de Registros</span>
          </div>
          <p className="font-sans">
            O Memorial Homenagens & Vinhetas Fúnebres não vende, não aluga e não repassa informações, fotos ou mensagens de luto a empresas de publicidade ou bancos de dados externos.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#16161D] border border-white/10 card-tactile">
          <div className="flex items-center gap-3 mb-4 text-red-400 font-bold font-sans text-lg">
            <Database className="w-5 h-5" />
            <span>3. Conformidade com a LGPD</span>
          </div>
          <p className="font-sans">
            Operamos em estrita observância à Lei Geral de Proteção de Dados (Lei nº 13.709/2018), resguardando o direito à intimidade, honra e memória dos cidadãos homenageados e de seus familiares.
          </p>
        </div>
      </div>
    </div>
  );
};
