import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'system' | 'dark' | 'light';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'memorial_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'system';
  });

  const getSystemIsDark = () => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
    } catch {
      // ignore
    }
    return getSystemIsDark() ? 'dark' : 'light';
  });

  const applyTheme = useCallback((mode: ThemeMode) => {
    if (typeof window === 'undefined') return;

    const isDark = mode === 'system' ? getSystemIsDark() : mode === 'dark';
    const active = isDark ? 'dark' : 'light';
    setResolvedTheme(active);

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    // Update or add general theme-color meta tag
    let meta = document.querySelector('meta[name="theme-color"]:not([media])') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = isDark ? '#09090B' : '#FAFAFA';
  }, []);

  useEffect(() => {
    applyTheme(themeMode);

    if (themeMode === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        applyTheme('system');
      };
      mql.addEventListener('change', listener);
      return () => mql.removeEventListener('change', listener);
    }
  }, [themeMode, applyTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
    applyTheme(mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
