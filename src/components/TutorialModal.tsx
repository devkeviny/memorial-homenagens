import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Sparkles, Share2, Check, ArrowRight } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Mic,
      title: '1. Conte com suas próprias palavras',
      desc: 'Você pode falar segurando o botão de microfone ou digitar uma mensagem simples com o nome do homenageado, datas e lembranças especiais.',
      badge: 'Voz ou Texto'
    },
    {
      icon: Sparkles,
      title: '2. Criação Solene & Inteligente',
      desc: 'Nossa inteligência memorial organiza com carinho o texto, cria a vinheta em áudio com fundo solene e prepara as homenagens visuais.',
      badge: 'Processamento Respeitoso'
    },
    {
      icon: Share2,
      title: '3. Baixe e Compartilhe Grátis',
      desc: 'Receba a vinheta em áudio de alta qualidade e as artes prontas para o Feed (3:4), Stories (9:16) e WhatsApp para confortar familiares e amigos.',
      badge: 'Sem Custos ou Anúncios'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('tutorial_chat_visto', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial_chat_visto', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const CurrentIcon = steps[step].icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#16161B] border border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.25)] text-white card-tactile"
        >
          {/* Header indicator */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase tracking-wider font-semibold text-red-400 font-sans">
              Guia de Boas-Vindas ({step + 1} de {steps.length})
            </span>
            <button
              onClick={handleSkip}
              className="text-xs text-zinc-400 hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-white/5 btn-tactile font-sans"
            >
              Pular
            </button>
          </div>

          {/* Step Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-950 via-[#1C1618] to-[#121217] border border-red-500/40 shadow-[0_0_25px_rgba(220,38,38,0.35)]">
              <CurrentIcon className="w-10 h-10 text-red-400 animate-pulse" />
              <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-md">
                {steps[step].badge}
              </span>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-center tracking-tight mb-3 font-sans">
            {steps[step].title}
          </h3>
          <p className="text-sm text-zinc-300 text-center leading-relaxed mb-8 min-h-[4.5rem] font-sans">
            {steps[step].desc}
          </p>

          {/* Step Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-gradient-to-r from-red-600 to-red-400' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={handleNext}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl btn-tactile-red text-white font-semibold text-sm transition-all active:scale-95 cursor-pointer font-sans"
          >
            {step === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Começar Agora</span>
              </>
            ) : (
              <>
                <span>Próximo Passo</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
