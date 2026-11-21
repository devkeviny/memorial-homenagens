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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#141418] border border-red-500/30 card-tactile text-white shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(220,38,38,0.25)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white btn-tactile transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-700 to-red-950 border border-red-500/40 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <Heart className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white font-sans">Apoie este Memorial</h3>
            <p className="text-xs text-zinc-400 font-sans">Serviço solene, gratuito e acolhedor</p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-sans">
          Desenvolvido com respeito para acolher famílias em seus momentos mais delicados. Sua contribuição voluntária via PIX nos ajuda a manter a plataforma rápida, gratuita e disponível para todos.
        </p>

        {/* QR Code Card */}
        <div className="flex flex-col items-center justify-center p-6 mb-6 rounded-2xl bg-[#0C0C0F] border border-white/10 card-tactile">
          <div className="p-3 bg-white rounded-xl shadow-xl mb-3">
            <QrCode className="w-32 h-32 text-black" />
          </div>
          <span className="text-xs text-zinc-400 font-medium font-sans">Chave PIX (E-mail):</span>
          <span className="text-sm font-semibold text-red-400 select-all mt-1 font-mono">{pixKey}</span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${
            copied ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'btn-tactile-red text-white'
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

        <p className="text-center text-xs text-zinc-500 mt-4 font-sans">
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
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 py-3 px-5 rounded-full bg-[#181820]/95 hover:bg-[#20202C] border border-red-500/40 text-white backdrop-blur-md transition-all btn-pix-floating group"
      title="Apoiar este memorial voluntariamente via PIX"
      aria-label="Apoiar via PIX"
    >
      <div className="relative flex items-center justify-center">
        <Heart className="w-4 h-4 text-red-500 fill-red-500/50 group-hover:scale-125 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
      </div>
      <span className="text-xs font-bold tracking-wider font-sans uppercase">Apoiar via PIX</span>
    </button>
  );
};
