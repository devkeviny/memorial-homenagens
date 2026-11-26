import React from 'react';
import { Home, Mic, Image, History, Info, Shield, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
  onOpenPix?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home' as ScreenId, label: 'Início', icon: Home },
    { id: 'chat' as ScreenId, label: 'Criar Vinheta', icon: Mic },
    { id: 'artes-submenu' as ScreenId, label: 'Criar Postagens', icon: Image },
    { id: 'historico' as ScreenId, label: 'Meu Histórico', icon: History },
    { id: 'sobre' as ScreenId, label: 'Sobre', icon: Info },
    { id: 'privacidade' as ScreenId, label: 'Privacidade', icon: Shield },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-surface/90 border-r border-hairline p-5 backdrop-blur-2xl z-30 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => onNavigate('home')}
        className="flex items-center gap-3.5 mb-8 cursor-pointer group"
      >
        <div className="relative w-11 h-11 rounded-2xl bg-surface-elevated border border-hairline flex items-center justify-center p-2 card-tactile group-hover:border-zinc-400 dark:group-hover:border-white/20 transition-all">
          <img 
            src="/assets/dove-red-flower.svg" 
            alt="Pomba com flor vermelha" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(220,38,38,0.35)]"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-primary font-sans">
            Memorial
          </h1>
          <p className="text-sm text-secondary font-cursive italic tracking-wide">
            Homenagens Solenes
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-full text-sm font-semibold transition-all duration-150 group font-sans cursor-pointer ${
                isActive
                  ? 'btn-menu-active-clean font-bold'
                  : 'text-secondary hover:text-primary hover:bg-surface-elevated'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.2]' : 'text-muted'}`} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer with Theme Selector */}
      <div className="pt-4 border-t border-hairline flex flex-col gap-3">
        {/* Theme Selector (Sistema / Escuro / Claro) */}
        <div>
          <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 px-1 font-sans">
            Aparência
          </span>
          <ThemeToggle />
        </div>

        {/* Quiet Info Box */}
        <div className="p-3 rounded-2xl bg-surface-elevated border border-hairline text-center card-tactile">
          <p className="text-[11px] text-muted leading-tight font-sans">
            Em memória daqueles que permanecem vivos em nossos corações.
          </p>
          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-muted font-bold uppercase tracking-wider font-sans">
            <Sparkles className="w-2.5 h-2.5 text-accent-wine" />
            Gratuito & Aberto
          </span>
        </div>
      </div>
    </aside>
  );
};
