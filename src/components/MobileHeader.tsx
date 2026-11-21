import React, { useState } from 'react';
import { Menu, X, Home, Mic, Image, History, Info, Shield, Heart } from 'lucide-react';
import { ScreenId } from '../types';

interface MobileHeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, mode?: 'vinheta' | 'artes') => void;
  onOpenPix: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ currentScreen, onNavigate, onOpenPix }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as ScreenId, label: 'Início', icon: Home },
    { id: 'chat' as ScreenId, label: 'Criar Vinheta', icon: Mic, mode: 'vinheta' as const },
    { id: 'artes-submenu' as ScreenId, label: 'Criar Artes', icon: Image },
    { id: 'historico' as ScreenId, label: 'Meu Histórico', icon: History },
    { id: 'sobre' as ScreenId, label: 'Sobre o Projeto', icon: Info },
    { id: 'privacidade' as ScreenId, label: 'Privacidade', icon: Shield },
  ];

  const handleSelect = (id: ScreenId, mode?: 'vinheta' | 'artes') => {
    onNavigate(id, mode);
    setIsOpen(false);
  };

  return (
    <>
      {/* Topbar Clean Mobile */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 bg-[#0C0C0F]/90 border-b border-white/5 backdrop-blur-xl">
        <div 
          onClick={() => handleSelect('home')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#16161B] border border-red-500/30 flex items-center justify-center p-1.5 shadow-[0_0_10px_rgba(220,38,38,0.25)]">
            <img 
              src="/src/assets/dove-red-flower.svg" 
              alt="Logo Memorial" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-white font-serif">
            Memorial
          </span>
        </div>

        {/* 48x48px Hamburger Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#16161B] border border-white/10 text-white active:scale-95 transition-transform"
          aria-label="Abrir Menu"
        >
          <Menu className="w-6 h-6 text-zinc-200" />
        </button>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 bg-[#0C0C0F]/98 backdrop-blur-2xl text-white animate-fade-in">
          {/* Top Row with Large X Button */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#16161B] border border-red-500/30 flex items-center justify-center p-2">
                <img 
                  src="/src/assets/dove-red-flower.svg" 
                  alt="Logo Memorial" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-base font-bold font-serif">Memorial</h2>
                <p className="text-xs text-zinc-400">Homenagens Solenes</p>
              </div>
            </div>

            {/* Large X Close Button (min 48x48px) */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white active:scale-90 transition-all hover:bg-white/20"
              aria-label="Fechar Menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Navigation Items (Large Touch Area) */}
          <nav className="flex flex-col gap-3.5 my-auto py-6">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-4 py-4 px-6 rounded-full text-base font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-red-800 to-red-600 text-white shadow-[0_0_25px_rgba(220,38,38,0.4)]'
                      : 'bg-[#16161B]/60 text-zinc-300 border border-white/5 active:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 text-red-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenPix();
              }}
              className="flex items-center justify-center gap-2.5 w-full py-4 rounded-full bg-white/5 hover:bg-white/10 border border-red-500/30 text-white text-sm font-medium"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500/40" />
              <span>Contribuir via PIX</span>
            </button>

            <p className="text-center text-xs text-zinc-500">
              Serviço Gratuito de Homenagens &copy; 2026
            </p>
          </div>
        </div>
      )}
    </>
  );
};
