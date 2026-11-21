import React from 'react';
import { Home, Mic, Image, History, Info, Shield } from 'lucide-react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
  onOpenPix?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, onOpenPix }) => {
  const navItems = [
    { id: 'home' as ScreenId, label: 'Início', icon: Home },
    { id: 'chat' as ScreenId, label: 'Criar Vinheta', icon: Mic, mode: 'vinheta' as const },
    { id: 'artes-submenu' as ScreenId, label: 'Criar Artes', icon: Image },
    { id: 'historico' as ScreenId, label: 'Meu Histórico', icon: History },
    { id: 'sobre' as ScreenId, label: 'Sobre', icon: Info },
    { id: 'privacidade' as ScreenId, label: 'Privacidade', icon: Shield },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#0C0C0F]/95 border-r border-white/5 p-6 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => onNavigate('home')}
        className="flex items-center gap-3.5 mb-10 cursor-pointer group"
      >
        <div className="relative w-11 h-11 rounded-2xl bg-[#16161B] border border-red-500/30 flex items-center justify-center p-2 shadow-[0_0_15px_rgba(220,38,38,0.25)] group-hover:border-red-500/60 transition-all">
          <img 
            src="/src/assets/dove-red-flower.svg" 
            alt="Pomba com flor vermelha" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
          />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white font-serif">
            Memorial
          </h1>
          <p className="text-[11px] text-zinc-400 font-sans tracking-wide">
            Homenagens Solenes
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id, item.mode)}
              className={`relative flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white shadow-[0_0_20px_rgba(220,38,38,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Vertical Luminous Indicator on Left Edge */}
              {isActive && (
                <span className="absolute -left-2 w-1.5 h-6 rounded-full bg-red-400 shadow-[0_0_10px_#EF4444]" />
              )}

              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="pt-6 border-t border-white/5">
        <div className="p-3.5 rounded-2xl bg-[#16161B]/60 border border-white/5 text-center">
          <p className="text-[11px] text-zinc-400 leading-tight">
            Em memória daqueles que permanecem vivos em nossos corações.
          </p>
          <span className="inline-block mt-2 text-[10px] text-red-400 font-medium">
            Gratuito & Aberto
          </span>
        </div>
      </div>
    </aside>
  );
};
