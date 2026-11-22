import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ClipboardCheck, Download, ArrowRight, Check } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: 'Fale no microfone ou escreva',
    text: 'Toque no microfone e conte os dados com suas palavras, ou digite no campo de texto.',
    Icon: Mic,
  },
  {
    title: 'Confira os dados',
    text: 'O assistente mostra tudo organizado. Se algo estiver errado, toque em Alterar dados.',
    Icon: ClipboardCheck,
  },
  {
    title: 'Baixe pronto',
    text: 'Receba a vinheta narrada em áudio e as postagens prontas para compartilhar com a família.',
    Icon: Download,
  },
] as const;

const FLOAT_POSITIONS = [
  'left-0 top-2 -rotate-6',
  'right-0 top-10 rotate-6',
  'left-6 bottom-0 rotate-3',
] as const;

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const last = step === STEPS.length - 1;
  const current = STEPS[step];

  useEffect(() => {
    if (isOpen) {
      nextRef.current?.focus();
    }
  }, [isOpen, step]);

  const handleNext = () => {
    if (!last) {
      setStep((prev) => prev + 1);
    } else {
      localStorage.setItem('tutorial_chat_visto', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial_chat_visto', 'true');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSkip();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        onKeyDown={handleKeyDown}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#09090B]/85 backdrop-blur-md select-none font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative flex w-full max-w-md flex-col items-center gap-6 py-6 px-4 sm:px-6 text-center"
        >
          {/* Floating Glassmorphism Hero Stage (from Caffeine zip) */}
          <div className="relative h-60 w-full flex items-center justify-center" aria-hidden="true">
            {/* Ambient Red Glow in Center */}
            <div className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/25 blur-3xl pointer-events-none animate-pulse" />

            {/* Orbiting Glass Cards */}
            {STEPS.map(({ Icon, title }, i) => (
              <motion.div
                key={title}
                animate={{
                  y: [0, -6, 0],
                  rotate: i === 0 ? [-6, -4, -6] : i === 1 ? [6, 8, 6] : [3, 1, 3]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className={`absolute flex size-24 items-center justify-center rounded-3xl border transition-all duration-300 ${
                  FLOAT_POSITIONS[i]
                } ${
                  i === step
                    ? 'z-10 scale-110 border-red-500/80 bg-white/15 shadow-[0_0_25px_rgba(220,38,38,0.5)] backdrop-blur-xl'
                    : 'border-white/10 bg-white/5 opacity-40 backdrop-blur-lg'
                }`}
              >
                <Icon
                  className={`size-10 ${
                    i === step ? 'text-red-400' : 'text-zinc-400'
                  }`}
                />
              </motion.div>
            ))}

            {/* Central Master Glass Card */}
            <motion.div 
              key={step}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 top-1/2 flex size-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
            >
              <current.Icon className="size-16 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
            </motion.div>
          </div>

          {/* Heading */}
          <h2
            id="tutorial-title"
            className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white font-sans"
          >
            COMO CRIAR SUA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">HOMENAGEM</span>
          </h2>

          {/* Step Description */}
          <div className="min-h-28 w-full" aria-live="polite">
            <p className="text-xs uppercase tracking-widest font-bold text-red-400 font-sans">
              Passo {step + 1} de {STEPS.length}
            </p>
            <h3 className="mt-1 text-xl sm:text-2xl font-bold text-white font-sans">
              {step + 1}. {current.title}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-sm mx-auto">
              {current.text}
            </p>
          </div>

          {/* Step Dots with Pill Expansion */}
          <div className="flex items-center gap-2" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span
                key={s.title}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.7)]' : 'w-2.5 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col items-center gap-3">
            <button
              ref={nextRef}
              onClick={handleNext}
              className="w-full py-4 rounded-full text-base sm:text-lg font-bold btn-tactile-red text-white shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-sans flex items-center justify-center gap-2"
            >
              <span>{last ? 'Começar' : 'Próximo →'}</span>
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="cursor-pointer rounded-full px-5 py-2 text-sm sm:text-base text-zinc-400 underline underline-offset-4 hover:text-white transition-colors font-sans"
            >
              Pular tutorial
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
