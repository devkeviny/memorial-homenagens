import React from 'react';
import { Loader2 } from 'lucide-react';

interface DynamicOrbProps {
  stage: string;
}

/**
 * Status Indicator - Solene & Anti-Slop (Substitui o antigo DynamicOrb com orbes flutuantes/pulsantes)
 * Indicador de status limpo, sóbrio e estático para etapas de processamento.
 */
export const DynamicOrb: React.FC<DynamicOrbProps> = ({ stage }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface border border-hairline shadow-sm animate-fade-in my-2 w-fit">
      {/* Sóbrio indicador de atividade com loader sutil */}
      <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-surface-elevated border border-hairline text-red-600 dark:text-red-500 shrink-0">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      </div>

      {/* Texto de Status */}
      <div className="flex flex-col">
        <span className="text-xs sm:text-sm font-semibold text-primary tracking-tight">
          {stage}
        </span>
        <span className="text-[10px] text-muted">
          Processamento da Homenagem Solene
        </span>
      </div>
    </div>
  );
};
