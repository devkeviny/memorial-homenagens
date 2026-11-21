import React, { useState } from 'react';
import { ScreenId } from './types';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { PixModal } from './components/PixModal';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { ArtesSubmenuScreen } from './screens/ArtesSubmenuScreen';
import { ChatScreen } from './screens/ChatScreen';
import { EditorPerfilScreen } from './screens/EditorPerfilScreen';
import { HistoricoScreen } from './screens/HistoricoScreen';
import { SobreScreen } from './screens/SobreScreen';
import { PrivacidadeScreen } from './screens/PrivacidadeScreen';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [chatInitialMode, setChatInitialMode] = useState<'vinheta' | 'artes'>('vinheta');
  const [isPixOpen, setIsPixOpen] = useState(false);

  const handleNavigate = (screen: ScreenId, mode?: 'vinheta' | 'artes') => {
    if (mode) {
      setChatInitialMode(mode);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0C0C0F] text-zinc-100 font-sans antialiased selection:bg-red-900 selection:text-white">
      {/* Mobile Top Header */}
      <MobileHeader
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenPix={() => setIsPixOpen(true)}
      />

      {/* Desktop Persistent Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenPix={() => setIsPixOpen(true)}
      />

      {/* Main Screen Content Body */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden pt-16 md:pt-0">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onOpenPix={() => setIsPixOpen(true)}
          />
        )}

        {currentScreen === 'artes-submenu' && (
          <ArtesSubmenuScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'chat' && (
          <ChatScreen
            onNavigate={handleNavigate}
            initialMode={chatInitialMode}
            onOpenPix={() => setIsPixOpen(true)}
          />
        )}

        {currentScreen === 'editor-perfil' && (
          <EditorPerfilScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'historico' && (
          <HistoricoScreen onNavigate={handleNavigate} />
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

      {/* Voluntary Contribution Pix Modal */}
      <PixModal
        isOpen={isPixOpen}
        onClose={() => setIsPixOpen(false)}
      />
    </div>
  );
};

export default App;
