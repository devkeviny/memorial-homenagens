import React, { useState } from 'react';
import { Menu, X, Home, Mic, Image, History, Info, Shield, Heart } from 'lucide-react';
import { ScreenId } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface MobileHeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
  onOpenPix: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ currentScreen, onNavigate, onOpenPix }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as ScreenId, label: 'Início', icon: Home },
    { id: 'chat' as ScreenId, label: 'Criar Vinheta', icon: Mic },
    { id: 'artes-submenu' as ScreenId, label: 'Criar Postagens', icon: Image },
    { id: 'historico' as ScreenId, label: 'Meu Histórico', icon: History },
    { id: 'sobre' as ScreenId, label: 'Sobre o Projeto', icon: Info },
    { id: 'privacidade' as ScreenId, label: 'Privacidade', icon: Shield },
  ];

  const handleSelect = (id: ScreenId) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Topbar Clean Mobile */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 bg-surface/90 border-b border-hairline backdrop-blur-xl">
        <div 
          onClick={() => handleSelect('home')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-hairline flex items-center justify-center p-1.5 shadow-sm card-tactile">
            <img 
              src="/assets/dove-red-flower.svg" 
              alt="Logo Memorial" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-primary font-sans">
            Memorial
          </span>
        </div>

        {/* 48x48px Hamburger Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-elevated border border-hairline text-primary btn-tactile active:scale-95 transition-transform"
          aria-label="Abrir Menu"
        >
          <Menu className="w-6 h-6 text-primary" />
        </button>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 bg-surface/98 backdrop-blur-2xl text-primary animate-fadeIn overflow-y-auto">
          {/* Top Row with Large X Button */}
          <div className="flex items-center justify-between pb-4 border-b border-hairline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-elevated border border-hairline flex items-center justify-center p-2 card-tactile">
                <img 
                  src="/assets/dove-red-flower.svg" 
                  alt="Logo Memorial" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-base font-bold font-sans text-primary">Memorial</h2>
                <p className="text-xs text-secondary font-sans">Homenagens Solenes</p>
              </div>
            </div>

            {/* Large X Close Button (min 48x48px) */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 flex items-center justify-center rounded-xl btn-tactile text-primary active:scale-90 transition-all hover:text-red-500"
              aria-label="Fechar Menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Theme Selector at the top of fullscreen menu (Requisito Inegociável 1) */}
          <div className="pt-4 pb-2">
            <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 px-1 font-sans">
              Aparência do Memorial
            </span>
            <ThemeToggle />
          </div>

          {/* Navigation Items (Large Touch Area) */}
          <nav className="flex flex-col gap-2 my-auto py-4">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-4 py-3.5 px-5 rounded-full text-base font-semibold tracking-wide transition-all font-sans ${
                    isActive
                      ? 'btn-menu-active-clean font-bold text-primary pl-7'
                      : 'text-secondary hover:text-primary hover:bg-surface-elevated'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.2]' : 'text-muted'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-hairline">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenPix();
              }}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl btn-tactile text-primary text-sm font-semibold font-sans hover:text-red-500"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500/30" />
              <span>Contribuir via PIX</span>
            </button>
            <p className="text-center text-[11px] text-muted font-sans">
              Serviço 100% gratuito e mantido com acolhimento pela comunidade
            </p>
          </div>
        </div>
      )}
    </>
  );
};
