import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Trash2, 
  Download, 
  Play, 
  Pause, 
  Volume2, 
  ArrowLeft, 
  ImageIcon, 
  LayoutGrid, 
  Calendar
} from 'lucide-react';
import { ScreenId, HistoryItem } from '../types';
import { createSolemnAudioBlob } from '../utils/canvasHelper';

interface HistoricoScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenPix: () => void;
}

export const HistoricoScreen: React.FC<HistoricoScreenProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('memorial_historico');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      }

      // Sample fallback item so the screen immediately illustrates saved media
      const sample: HistoryItem[] = [
        {
          id: 'sample_01',
          type: 'vinheta',
          name: 'Dona Helena Silveira',
          dateStr: '20/11/2026 14:30',
          timestamp: Date.now() - 86400000,
          audioDuration: '00:42',
          audioTitle: 'Vinheta Solene - Dona Helena Silveira',
          details: {
            nascimento: '10/03/1939',
            falecimento: '19/11/2026',
            velorio: 'Memorial Esperança - Sala 1',
            sepultamento: 'Cemitério da Saudade',
            mensagem: '“Sua bondade continuará iluminando os passos de todos nós.”'
          }
        }
      ];
      setItems(sample);
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza de que deseja limpar todo o histórico de homenagens salvas neste dispositivo?')) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingItemId(null);
      localStorage.removeItem('memorial_historico');
      setItems([]);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingItemId === id && audioRef.current) {
      audioRef.current.pause();
      setPlayingItemId(null);
    }
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    try {
      localStorage.setItem('memorial_historico', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving updated history:', err);
    }
  };

  // Play audio preview
  const handlePlayAudio = (item: HistoryItem) => {
    if (playingItemId === item.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingItemId(null);
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audioBlob = createSolemnAudioBlob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingItemId(null);
      };

      audio.play().then(() => {
        setPlayingItemId(item.id);
      }).catch((err) => {
        console.warn('Playback error:', err);
        setPlayingItemId(null);
      });
    } catch (err) {
      console.error('Error generating audio:', err);
      setPlayingItemId(null);
    }
  };

  const handleDownloadAudio = (title?: string) => {
    const audioBlob = createSolemnAudioBlob();
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'vinheta-solene'}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadImage = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-80px)] px-4 sm:px-8 py-6 max-w-5xl mx-auto select-none font-sans animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-hairline">
        <div>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors mb-2 cursor-pointer font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-accent-wine" />
            <span>Voltar ao Início</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-sans inline-block">
              Meu Histórico de Homenagens
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-elevated border border-hairline text-secondary font-sans">
              {items.length} {items.length === 1 ? 'salva' : 'salvas'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1 font-sans">
            Suas criações salvas com áudios e imagens acessíveis diretamente neste dispositivo.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-red-600 dark:hover:text-red-400 btn-tactile transition-colors cursor-pointer font-sans"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico</span>
          </button>
        )}
      </div>

      {/* Main List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-surface border border-hairline card-tactile my-auto">
          <div className="w-16 h-16 rounded-full bg-surface-elevated border border-hairline flex items-center justify-center text-accent-wine mb-4 shadow-sm">
            <Radio className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2 font-sans">
            Nenhuma homenagem salva ainda
          </h2>
          <p className="text-xs sm:text-sm text-secondary max-w-md mb-6 leading-relaxed font-sans">
            As vinhetas em áudio e artes visuais geradas no chat ou no editor ficarão armazenadas automaticamente aqui no seu navegador.
          </p>
          <button
            onClick={() => onNavigate('chat')}
            className="px-6 py-3 rounded-xl btn-tactile-white text-xs sm:text-sm font-semibold transition-all cursor-pointer font-sans"
          >
            Criar Minha Primeira Homenagem
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => {
            const isRecent = index === 0;
            const hasAudio = item.type === 'vinheta' || Boolean(item.audioDuration);
            const hasImages = Boolean(item.artRatio34Url || item.artRatio916Url || item.previewUrl);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className={`relative flex flex-col p-5 sm:p-7 rounded-3xl bg-surface border transition-all overflow-hidden card-tactile ${
                  isRecent 
                    ? 'border-red-600/50 shadow-md' 
                    : 'border-hairline shadow-sm'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-hairline">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-hairline flex items-center justify-center text-primary shadow-sm">
                      {item.type === 'vinheta' ? <Radio className="w-5 h-5 text-accent-wine" /> : <LayoutGrid className="w-5 h-5 text-accent-wine" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-wide uppercase text-accent-wine font-sans">
                          {item.type === 'vinheta' ? 'Vinheta & Postagens' : item.type === 'post-duplo' ? 'Post Duplo' : 'Foto Perfil'}
                        </span>
                        {isRecent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-elevated border border-hairline text-secondary">
                            Mais Recente
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-primary font-sans">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-secondary font-sans">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      <span>{item.dateStr}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-2 rounded-xl text-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-surface-elevated transition-colors cursor-pointer"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Direct Visual Media Gallery */}
                {hasImages && (
                  <div className="mt-4 pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 font-sans">
                        <ImageIcon className="w-3.5 h-3.5 text-accent-wine" />
                        <span>Postagens Comemorativas Salvas</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Feed 3:4 or preview */}
                      {(item.artRatio34Url || item.previewUrl) && (
                        <div className="p-3.5 rounded-2xl bg-surface-elevated border border-hairline flex flex-col justify-between card-tactile">
                          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black/10 dark:bg-zinc-950 border border-hairline mb-3 card-tactile flex items-center justify-center">
                            <img
                              src={item.artRatio34Url || item.previewUrl}
                              alt={`Feed - ${item.name}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-surface/90 border border-hairline text-[10px] font-bold text-primary uppercase font-sans">
                              Feed 3:4
                            </span>
                          </div>

                          <button
                            onClick={() => handleDownloadImage(item.artRatio34Url || item.previewUrl!, `memorial-${item.name.toLowerCase().replace(/\\s+/g, '-')}-feed.png`)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-tactile text-primary text-xs font-bold transition-all cursor-pointer font-sans"
                          >
                            <Download className="w-3.5 h-3.5 text-accent-wine" />
                            <span>Baixar Feed (PNG)</span>
                          </button>
                        </div>
                      )}

                      {/* Stories 9:16 */}
                      {item.artRatio916Url && (
                        <div className="p-3.5 rounded-2xl bg-surface-elevated border border-hairline flex flex-col justify-between card-tactile">
                          <div className="relative aspect-[9/16] w-full max-h-[380px] rounded-xl overflow-hidden bg-black/10 dark:bg-zinc-950 border border-hairline mb-3 card-tactile flex items-center justify-center mx-auto">
                            <img
                              src={item.artRatio916Url}
                              alt={`Stories - ${item.name}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-surface/90 border border-hairline text-[10px] font-bold text-primary uppercase font-sans">
                              Stories 9:16 (WhatsApp)
                            </span>
                          </div>

                          <button
                            onClick={() => handleDownloadImage(item.artRatio916Url!, `memorial-${item.name.toLowerCase().replace(/\\s+/g, '-')}-stories.png`)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-tactile text-primary text-xs font-bold transition-all cursor-pointer font-sans"
                          >
                            <Download className="w-3.5 h-3.5 text-accent-wine" />
                            <span>Baixar Stories (PNG)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Direct Audio Player */}
                {hasAudio && (
                  <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-surface-elevated border border-hairline text-primary shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface border border-hairline flex items-center justify-center text-accent-wine shadow-sm shrink-0">
                          <Volume2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-primary font-sans">
                            {item.audioTitle || `Vinheta Solene em Áudio - ${item.name}`}
                          </h4>
                          <span className="text-xs text-secondary font-sans">
                            Masterizado com Voz Solene e Trilha Orquestrada
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-mono text-secondary bg-surface px-2 py-1 rounded-md border border-hairline">
                          {item.audioDuration || '00:42'}
                        </span>
                      </div>
                    </div>

                    {/* Equalizer Bars */}
                    <div className="flex items-center justify-between gap-1 h-9 px-3 rounded-xl bg-surface mb-3 border border-hairline">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            playingItemId === item.id
                              ? 'bg-red-600'
                              : 'bg-zinc-300 dark:bg-zinc-700'
                          }`}
                          style={{
                            height: playingItemId === item.id
                              ? `${Math.max(25, Math.sin(i * 0.7) * 85 + 35)}%`
                              : `${(i % 5 + 2) * 16}%`
                          }}
                        />
                      ))}
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-hairline">
                      <button
                        onClick={() => handlePlayAudio(item)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-tactile-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer font-sans"
                      >
                        {playingItemId === item.id ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span>Pausar Homenagem</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Ouvir Vinheta</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDownloadAudio(item.audioTitle || `vinheta-${item.name}`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-tactile text-primary text-xs font-semibold transition-all cursor-pointer font-sans"
                      >
                        <Download className="w-3.5 h-3.5 text-accent-wine" />
                        <span>Baixar Áudio (.wav)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Details Summary Card */}
                {item.details && (
                  <div className="mt-4 p-3.5 rounded-xl bg-surface-elevated border border-hairline text-xs text-secondary space-y-1.5 font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.details.nascimento && (
                        <div><span className="text-muted">Nascimento:</span> <span className="text-primary font-semibold">{item.details.nascimento}</span></div>
                      )}
                      {item.details.falecimento && (
                        <div><span className="text-muted">Falecimento:</span> <span className="text-primary font-semibold">{item.details.falecimento}</span></div>
                      )}
                      {item.details.velorio && (
                        <div><span className="text-muted">Velório:</span> <span className="text-primary font-semibold">{item.details.velorio}</span></div>
                      )}
                      {item.details.sepultamento && (
                        <div><span className="text-muted">Sepultamento:</span> <span className="text-primary font-semibold">{item.details.sepultamento}</span></div>
                      )}
                    </div>
                    {item.details.mensagem && (
                      <p className="italic pt-2 mt-2 border-t border-hairline text-secondary">
                        {item.details.mensagem}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
