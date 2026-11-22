import React from 'react';
import { Home, Mic, Image, History, Info, Shield, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
  onOpenPix?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, onOpenPix }) => {
  const navItems = [
    { id: 'home' as ScreenId, label: 'Início', icon: Home },
    { id: 'chat' as ScreenId, label: 'Criar Vinheta', icon: Mic },
    { id: 'artes-submenu' as ScreenId, label: 'Criar Postagens', icon: Image },
    { id: 'historico' as ScreenId, label: 'Meu Histórico', icon: History },
    { id: 'sobre' as ScreenId, label: 'Sobre', icon: Info },
    { id: 'privacidade' as ScreenId, label: 'Privacidade', icon: Shield },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#0C0C0F]/95 border-r border-white/10 p-6 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => onNavigate('home')}
        className="flex items-center gap-3.5 mb-10 cursor-pointer group"
      >
        <div className="relative w-11 h-11 rounded-2xl bg-[#16161D] border border-white/10 flex items-center justify-center p-2 card-tactile shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-white/20 transition-all">
          <img 
            src="/assets/dove-red-flower.svg" 
            alt="Pomba com flor vermelha" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white font-sans">
            Memorial
          </h1>
          <p className="text-sm text-zinc-300 font-cursive italic tracking-wide">
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
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center gap-4 px-4 py-3.5 rounded-full text-base font-semibold transition-all duration-200 group font-sans cursor-pointer ${
                isActive
                  ? 'btn-menu-active-white font-bold nav-active text-white bg-white/10'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white stroke-[2.5]' : 'text-zinc-400'}`} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="pt-6 border-t border-white/10">
        <div className="p-3.5 rounded-2xl bg-[#141418] border border-white/5 text-center card-tactile">
          <p className="text-[11px] text-zinc-400 leading-tight font-sans">
            Em memória daqueles que permanecem vivos em nossos corações.
          </p>
          <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-sans">
            <Sparkles className="w-2.5 h-2.5" />
            Gratuito & Aberto
          </span>
        </div>
      </div>
    </aside>
  );
};
