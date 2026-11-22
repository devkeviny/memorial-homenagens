import React, { useState, useEffect, useCallback } from 'react';
import { ScreenId } from './types';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { PixModal, FloatingPixButton } from './components/PixModal';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { ArtesSubmenuScreen } from './screens/ArtesSubmenuScreen';
import { TemplatesArtesScreen } from './screens/TemplatesArtesScreen';
import { ChatScreen } from './screens/ChatScreen';
import { EditorPerfilScreen } from './screens/EditorPerfilScreen';
import { HistoricoScreen } from './screens/HistoricoScreen';
import { SobreScreen } from './screens/SobreScreen';
import { PrivacidadeScreen } from './screens/PrivacidadeScreen';

const VALID_SCREENS: Record<string, ScreenId> = {
  '': 'home',
  'home': 'home',
  'inicio': 'home',
  'artes-submenu': 'artes-submenu',
  'postagens': 'artes-submenu',
  'criar-postagens': 'artes-submenu',
  'templates-artes': 'templates-artes',
  'templates': 'templates-artes',
  'templates-customizar': 'templates-artes',
  'chat': 'chat',
  'vinheta': 'chat',
  'criar-vinheta': 'chat',
  'editor-perfil': 'editor-perfil',
  'foto-perfil': 'editor-perfil',
  'foto-perfil-ajuste': 'editor-perfil',
  'foto-perfil-customizar': 'editor-perfil',
  'historico': 'historico',
  'meu-historico': 'historico',
  'sobre': 'sobre',
  'privacidade': 'privacidade',
};

const SCREEN_HASH_MAP: Record<ScreenId, string> = {
  'home': 'home',
  'artes-submenu': 'postagens',
  'templates-artes': 'templates',
  'chat': 'chat',
  'editor-perfil': 'foto-perfil',
  'historico': 'historico',
  'sobre': 'sobre',
  'privacidade': 'privacidade',
};

function getScreenFromHash(): ScreenId {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  return VALID_SCREENS[raw] || 'home';
}

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => getScreenFromHash());
  const [isPixOpen, setIsPixOpen] = useState(false);

  // Sync state with browser back/forward buttons (Popstate & Hashchange)
  useEffect(() => {
    const handlePopState = () => {
      const screen = getScreenFromHash();
      setCurrentScreen(screen);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Initial check: if there is no hash, initialize with #home so back button works predictably
    if (!window.location.hash || window.location.hash === '#/') {
      window.history.replaceState({ screen: 'home' }, '', '#home');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigate = useCallback((screen: ScreenId) => {
    setCurrentScreen(screen);
    const targetHash = `#${SCREEN_HASH_MAP[screen] || screen}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-floral-solemn text-zinc-100 font-sans antialiased selection:bg-red-900 selection:text-white">
      {/* Mobile Top Header (Sticky with 48x48 hamburger and full screen menu) */}
      <MobileHeader
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenPix={() => setIsPixOpen(true)}
      />

      {/* Desktop Persistent Sidebar (Fixed on left, dove logo, luminous indicator) */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenPix={() => setIsPixOpen(true)}
      />

      {/* Main Screen Content Body */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onOpenPix={() => setIsPixOpen(true)}
          />
        )}

        {currentScreen === 'artes-submenu' && (
          <ArtesSubmenuScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'templates-artes' && (
          <TemplatesArtesScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'chat' && (
          <ChatScreen
            onNavigate={handleNavigate}
            onOpenPix={() => setIsPixOpen(true)}
          />
        )}

        {currentScreen === 'editor-perfil' && (
          <EditorPerfilScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'historico' && (
          <HistoricoScreen
            onNavigate={handleNavigate}
            onOpenPix={() => setIsPixOpen(true)}
          />
        )}

        {currentScreen === 'sobre' && (
          <SobreScreen
            onNavigate={handleNavigate}
            onOpenPix={() => setIsPixOpen(true)}
          />
        )}

        {currentScreen === 'privacidade' && (
          <PrivacidadeScreen onNavigate={handleNavigate} />
        )}
      </main>

      {/* Persistent Floating PIX Button with Micro-Interaction / Glow (Oculto na tela do Chat para dar lugar ao botão integrado na barra) */}
      {currentScreen !== 'chat' && (
        <FloatingPixButton onOpen={() => setIsPixOpen(true)} />
      )}

      {/* Voluntary Contribution Pix Modal */}
      <PixModal
        isOpen={isPixOpen}
        onClose={() => setIsPixOpen(false)}
      />
    </div>
  );
};

export default App;
