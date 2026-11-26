import React from 'react';
import { X, PlayCircle, MessageSquare, Image, ShieldCheck, Heart } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPix?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onOpenPix }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="relative w-full max-w-lg bg-surface border border-hairline rounded-3xl shadow-2xl overflow-hidden card-tactile flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-hairline bg-surface-elevated">
          <div className="flex items-center space-x-2.5">
            <PlayCircle className="w-5 h-5 text-accent-wine" />
            <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight font-sans">
              Como Funciona o Memorial
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-secondary hover:text-primary rounded-xl hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm font-sans text-secondary">
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-elevated border border-hairline text-accent-wine flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-bold text-primary mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-accent-wine" />
                <span>Converse com o Assistente Solene</span>
              </h4>
              <p className="leading-relaxed text-xs sm:text-sm">
                Envie mensagens de texto ou áudio contando a história, datas, frases e momentos marcantes do seu ente querido.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-elevated border border-hairline text-accent-wine flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-bold text-primary mb-1 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-accent-wine" />
                <span>Escolha o Formato e Personalize</span>
              </h4>
              <p className="leading-relaxed text-xs sm:text-sm">
                No menu de <b>Formatos e Artes</b>, selecione entre <b>Foto de Perfil com Luto</b> ou <b>Modelos Solenes</b> (3:4 ou Stories 9:16). Ajuste fotos com pinça e enquadramento touch nativo.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-elevated border border-hairline text-accent-wine flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-bold text-primary mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent-wine" />
                <span>Baixe em Alta Resolução Grátis</span>
              </h4>
              <p className="leading-relaxed text-xs sm:text-sm">
                Faça o download imediato da arte em PNG cristalino de 1080px e do áudio narrado com voz serena sem qualquer custo obrigatório.
              </p>
            </div>
          </div>

          {/* Donation Note */}
          <div className="p-4 rounded-2xl bg-surface-elevated border border-hairline flex items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-accent-wine flex-shrink-0" />
              <p className="text-xs text-secondary leading-snug">
                Este projeto é gratuito e independente. Você pode apoiar a manutenção do servidor via PIX voluntário.
              </p>
            </div>
            {onOpenPix && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPix();
                }}
                className="px-3 py-1.5 rounded-xl btn-tactile text-xs font-bold text-primary whitespace-nowrap cursor-pointer"
              >
                Apoiar
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-hairline bg-surface-elevated flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-tactile-white font-bold text-sm transition-all cursor-pointer font-sans shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
