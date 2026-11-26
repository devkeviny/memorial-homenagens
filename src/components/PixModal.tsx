import React, { useState } from 'react';
import { Heart, Copy, Check, X, QrCode } from 'lucide-react';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PixModal: React.FC<PixModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const pixKey = 'kevinnyfonseca@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-surface border border-hairline card-tactile text-primary shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-secondary hover:text-primary btn-tactile transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-elevated border border-hairline shadow-sm">
            <Heart className="w-6 h-6 text-accent-wine" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-primary font-sans">Apoie este Memorial</h3>
            <p className="text-xs text-secondary font-sans">Serviço solene, gratuito e acolhedor</p>
          </div>
        </div>

        <p className="text-sm text-secondary leading-relaxed mb-6 font-sans">
          Desenvolvido com respeito para acolher famílias em seus momentos mais delicados. Sua contribuição voluntária via PIX nos ajuda a manter a plataforma rápida, gratuita e disponível para todos.
        </p>

        {/* QR Code Card */}
        <div className="flex flex-col items-center justify-center p-6 mb-6 rounded-2xl bg-surface-elevated border border-hairline card-tactile">
          <div className="p-3 bg-white rounded-xl shadow-md mb-3 border border-zinc-200">
            <QrCode className="w-32 h-32 text-black" />
          </div>
          <span className="text-xs text-muted font-medium font-sans">Chave PIX (E-mail):</span>
          <span className="text-sm font-semibold text-primary select-all mt-1 font-mono">{pixKey}</span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            copied ? 'bg-emerald-600 text-white shadow-md' : 'btn-tactile-white font-bold'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Chave PIX Copiada com Sucesso!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Chave PIX</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted mt-4 font-sans">
          Qualquer valor é recebido com profundo respeito e gratidão.
        </p>
      </div>
    </div>
  );
};

export const FloatingPixButton: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 py-3 px-5 rounded-full bg-surface-elevated border border-hairline text-primary backdrop-blur-md transition-all btn-pix-floating group cursor-pointer shadow-lg"
      title="Apoiar este memorial voluntariamente via PIX"
      aria-label="Apoiar PIX"
    >
      <div className="relative flex items-center justify-center">
        <Heart className="w-4 h-4 text-accent-wine group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-xs font-bold tracking-wider font-sans uppercase text-primary">Apoiar PIX</span>
    </button>
  );
};
