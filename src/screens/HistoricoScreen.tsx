import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, 
  Trash2, 
  Download, 
  Play, 
  Pause, 
  Volume2, 
  Sparkles, 
  ArrowLeft, 
  ImageIcon, 
  LayoutGrid, 
  User, 
  Calendar,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { ScreenId, HistoryItem } from '../types';
import { createSolemnAudioBlob } from '../utils/canvasHelper';

interface HistoricoScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenPix: () => void;
}

export const HistoricoScreen: React.FC<HistoricoScreenProps> = ({ onNavigate, onOpenPix }) => {
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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
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

        if ('speechSynthesis' in window) {
          const tributeText = `Em memória solene de ${item.name}. ${item.details?.mensagem || 'Que o amor e as lembranças sejam eterno consolo.'}`;
          const utterance = new SpeechSynthesisUtterance(tributeText);
          utterance.lang = 'pt-BR';
          utterance.rate = 0.85;
          utterance.pitch = 0.85;
          window.speechSynthesis.speak(utterance);
        }
      }).catch((e) => {
        console.warn('Playback error:', e);
        setPlayingItemId(null);
      });
    } catch (e) {
      console.error('Audio playback failed:', e);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-2 cursor-pointer font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Início</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Histórico de Homenagens
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 border border-red-500/40 text-red-300 font-sans">
              {items.length} {items.length === 1 ? 'salva' : 'salvas'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
            Suas criações salvas com áudios e imagens acessíveis diretamente neste dispositivo.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-red-400 btn-tactile transition-colors cursor-pointer font-sans"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico</span>
          </button>
        )}
      </div>

      {/* Main List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-[#16161D] border border-white/10 card-tactile my-auto">
          <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <Radio className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-sans">
            Nenhuma homenagem salva ainda
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6 leading-relaxed font-sans">
            As vinhetas em áudio e artes visuais geradas no chat ou no editor ficarão armazenadas automaticamente aqui no seu navegador.
          </p>
          <button
            onClick={() => onNavigate('chat')}
            className="px-6 py-3 rounded-xl btn-tactile-red text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer font-sans"
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
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative flex flex-col p-5 sm:p-7 rounded-3xl bg-[#16161D] border transition-all overflow-hidden card-tactile ${
                  isRecent 
                    ? 'border-red-500/60 shadow-[0_4px_30px_rgba(220,38,38,0.2)]' 
                    : 'border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white shadow-[0_2px_10px_rgba(220,38,38,0.4)]">
                      {item.type === 'vinheta' ? <Radio className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-wide uppercase text-red-400 font-sans">
                          {item.type === 'vinheta' ? 'Vinheta & Artes' : item.type === 'post-duplo' ? 'Post Duplo' : 'Foto Perfil'}
                        </span>
                        {isRecent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/80 border border-red-500/40 text-red-300">
                            Mais Recente
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white font-sans">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-zinc-400 font-sans">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{item.dateStr}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Direct Visual Media Gallery (Já abre exibindo as imagens) */}
                {hasImages && (
                  <div className="mt-4 pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-sans">
                        <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                        <span>Artes Comemorativas Salvas</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Feed 3:4 or preview */}
                      {(item.artRatio34Url || item.previewUrl) && (
                        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between card-tactile">
                          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/5 mb-3 card-tactile flex items-center justify-center">
                            <img
                              src={item.artRatio34Url || item.previewUrl}
                              alt={`Feed - ${item.name}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/80 border border-white/10 text-[10px] font-bold text-zinc-200 uppercase font-sans">
                              Feed 3:4 (Alta Definição)
                            </span>
                          </div>

                          <button
                            onClick={() => handleDownloadImage(item.artRatio34Url || item.previewUrl!, `memorial-${item.name.toLowerCase().replace(/\s+/g, '-')}-feed.png`)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-tactile text-white text-xs font-bold transition-all cursor-pointer font-sans"
                          >
                            <Download className="w-3.5 h-3.5 text-red-400" />
                            <span>Baixar Feed (PNG)</span>
                          </button>
                        </div>
                      )}

                      {/* Stories 9:16 */}
                      {item.artRatio916Url && (
                        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between card-tactile">
                          <div className="relative aspect-[9/16] w-full max-h-[380px] rounded-xl overflow-hidden bg-zinc-950 border border-white/5 mb-3 card-tactile flex items-center justify-center mx-auto">
                            <img
                              src={item.artRatio916Url}
                              alt={`Stories - ${item.name}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/80 border border-white/10 text-[10px] font-bold text-zinc-200 uppercase font-sans">
                              Stories 9:16 (WhatsApp)
                            </span>
                          </div>

                          <button
                            onClick={() => handleDownloadImage(item.artRatio916Url!, `memorial-${item.name.toLowerCase().replace(/\s+/g, '-')}-stories.png`)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-tactile text-white text-xs font-bold transition-all cursor-pointer font-sans"
                          >
                            <Download className="w-3.5 h-3.5 text-red-400" />
                            <span>Baixar Stories (PNG)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Direct Audio Player (Já abre exibindo o áudio com player interativo) */}
                {hasAudio && (
                  <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#181822] to-[#121218] border border-red-500/40 text-white shadow-[0_0_20px_rgba(220,38,38,0.15)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)] shrink-0">
                          <Volume2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white font-sans">
                            {item.audioTitle || `Vinheta Solene em Áudio - ${item.name}`}
                          </h4>
                          <span className="text-xs text-zinc-400 font-sans">
                            Masterizado com Voz Solene e Trilha Orquestrada
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-mono text-zinc-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                          {item.audioDuration || '00:42'}
                        </span>
                      </div>
                    </div>

                    {/* Equalizer Bars */}
                    <div className="flex items-center justify-between gap-1 h-9 px-3 rounded-xl bg-black/50 mb-3 border border-white/5">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            playingItemId === item.id
                              ? 'bg-red-500 animate-pulse'
                              : 'bg-zinc-700'
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
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                      <button
                        onClick={() => handlePlayAudio(item)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-tactile-red text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                      >
                        {playingItemId === item.id ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span>Pausar Homenagem</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-white" />
                            <span>Ouvir Vinheta</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDownloadAudio(item.audioTitle || `vinheta-${item.name}`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-tactile text-white text-xs font-semibold transition-all cursor-pointer font-sans"
                      >
                        <Download className="w-3.5 h-3.5 text-red-400" />
                        <span>Baixar Áudio (.wav)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Details Summary Card */}
                {item.details && (
                  <div className="mt-4 p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 space-y-1.5 font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.details.nascimento && (
                        <div><span className="text-zinc-500">Nascimento:</span> <span className="text-zinc-200 font-semibold">{item.details.nascimento}</span></div>
                      )}
                      {item.details.falecimento && (
                        <div><span className="text-zinc-500">Falecimento:</span> <span className="text-zinc-200 font-semibold">{item.details.falecimento}</span></div>
                      )}
                      {item.details.velorio && (
                        <div><span className="text-zinc-500">Velório:</span> <span className="text-zinc-200 font-semibold">{item.details.velorio}</span></div>
                      )}
                      {item.details.sepultamento && (
                        <div><span className="text-zinc-500">Sepultamento:</span> <span className="text-zinc-200 font-semibold">{item.details.sepultamento}</span></div>
                      )}
                    </div>
                    {item.details.mensagem && (
                      <p className="italic pt-2 mt-2 border-t border-white/5 text-zinc-400">
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
