import React from 'react';

interface DynamicOrbProps {
  stage: string;
}

export const DynamicOrb: React.FC<DynamicOrbProps> = ({ stage }) => {
  return (
    <div className="flex items-center gap-3.5 px-5 py-3 rounded-full bg-[#18181F]/90 border border-red-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.25)] animate-fade-in my-3 w-fit">
      {/* Animated Orb */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <span className="absolute w-full h-full rounded-full bg-red-600/40 animate-ping" />
        <span className="relative w-4 h-4 rounded-full bg-gradient-to-tr from-red-600 to-amber-200 shadow-[0_0_12px_#DC2626] animate-pulse" />
      </div>
      
      {/* Dynamic Text */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white tracking-wide">
          {stage}
        </span>
        <span className="text-[11px] text-zinc-400">
          Inteligência Memorial em processamento solene
        </span>
      </div>
    </div>
  );
};
