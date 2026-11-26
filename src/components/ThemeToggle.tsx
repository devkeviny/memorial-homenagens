import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'compact' | 'segmented';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', variant = 'segmented' }) => {
  const { themeMode, setThemeMode } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'system', label: 'Sistema', icon: Laptop },
    { mode: 'dark', label: 'Escuro', icon: Moon },
    { mode: 'light', label: 'Claro', icon: Sun },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-hairline ${className}`}>
        {options.map(({ mode, label, icon: Icon }) => {
          const isActive = themeMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setThemeMode(mode)}
              title={`Tema: ${label}`}
              className={`p-2 rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-surface text-primary shadow-sm border border-hairline'
                  : 'text-muted hover:text-primary hover:bg-surface/50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Seletor de tema visual"
      className={`grid grid-cols-3 gap-1 p-1 rounded-2xl bg-surface-elevated border border-hairline ${className}`}
    >
      {options.map(({ mode, label, icon: Icon }) => {
        const isActive = themeMode === mode;
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setThemeMode(mode)}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 ${
              isActive
                ? 'bg-surface text-primary shadow-sm border border-hairline font-bold'
                : 'text-muted hover:text-primary hover:bg-surface/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
