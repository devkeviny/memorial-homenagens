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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#16161B]/95 border border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.3)] text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-900 to-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Apoie este Memorial</h3>
            <p className="text-xs text-zinc-400">Serviço 100% gratuito e sem anúncios</p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          Desenvolvido com carinho para acolher famílias em seus momentos mais delicados. Sua contribuição voluntária via PIX nos ajuda a manter os servidores ativos e gratuitos para todos.
        </p>

        {/* QR Code Mock Card */}
        <div className="flex flex-col items-center justify-center p-6 mb-6 rounded-2xl bg-[#0C0C0F] border border-white/5">
          <div className="p-3 bg-white rounded-xl shadow-lg mb-3">
            <QrCode className="w-32 h-32 text-black" />
          </div>
          <span className="text-xs text-zinc-400 font-medium">Chave PIX (E-mail):</span>
          <span className="text-sm font-semibold text-red-400 select-all mt-0.5">{pixKey}</span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-medium text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Chave PIX Copiada com Sucesso!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Chave PIX</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-zinc-500 mt-4">
          Qualquer valor é recebido com imensa gratidão e orações.
        </p>
      </div>
    </div>
  );
};

export const FloatingPixButton: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 py-3 px-5 rounded-full bg-[#16161B]/90 hover:bg-[#1C1C24] border border-red-500/40 text-white shadow-[0_0_25px_rgba(220,38,38,0.35)] backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
      title="Apoiar projeto via PIX"
    >
      <Heart className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform fill-red-500/30" />
      <span className="text-xs font-semibold tracking-wide">Apoiar via PIX</span>
    </button>
  );
};
