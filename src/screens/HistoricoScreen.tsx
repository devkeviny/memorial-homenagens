import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  Radio, 
  LayoutGrid, 
  User, 
  Calendar, 
  Eye, 
  Clock, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ScreenId, HistoryItem } from '../types';

interface HistoricoScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const HistoricoScreen: React.FC<HistoricoScreenProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('memorial_historico');
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        // Sample item if clean
        const sample: HistoryItem[] = [
          {
            id: 'sample_01',
            type: 'vinheta',
            name: 'Dona Helena Silveira',
            dateStr: '20/11/2026 14:30',
            timestamp: Date.now() - 86400000,
            audioDuration: '00:42',
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
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza de que deseja limpar todo o histórico de homenagens salvas neste dispositivo?')) {
      localStorage.removeItem('memorial_historico');
      setItems([]);
      setSelectedItem(null);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem('memorial_historico', JSON.stringify(updated));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in select-none">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16161B]/80 hover:bg-[#1C1C24] border border-white/10 hover:border-red-500/40 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-red-400" />
          <span>Voltar ao Início</span>
        </button>

        {items.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs font-medium text-red-300 hover:text-white transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico</span>
          </button>
        )}
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white font-serif tracking-tight">
          Minhas Homenagens Salvas
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">
          Todas as vinhetas, artes de feed, stories e fotos de perfil geradas ficam guardadas localmente no seu aparelho.
        </p>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-[#16161B]/60 border border-white/5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-4">
            <Clock className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-serif mb-2">Nenhuma homenagem gerada ainda</h3>
          <p className="text-sm text-zinc-400 max-w-sm mb-6">
            Inicie uma conversa solene ou crie uma foto de perfil de luto para salvar suas recordações aqui.
          </p>
          <button
            onClick={() => onNavigate('chat')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
          >
            Criar Minha Primeira Vinheta
          </button>
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedItem(item)}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#16161B]/90 border border-white/10 hover:border-red-500/40 shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all cursor-pointer overflow-hidden backdrop-blur-xl"
            >
              <div>
                {/* Header Tag + Action */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    {item.type === 'vinheta' && <Radio className="w-3 h-3" />}
                    {item.type === 'post-duplo' && <LayoutGrid className="w-3 h-3" />}
                    {item.type === 'foto-perfil' && <User className="w-3 h-3" />}
                    {item.type === 'vinheta' ? 'Vinheta Áudio' : item.type === 'post-duplo' ? 'Post Duplo' : 'Foto Perfil'}
                  </span>

                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Excluir item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview Thumbnail if present */}
                {item.previewUrl && (
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-4 flex items-center justify-center">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Name */}
                <h3 className="text-lg font-bold text-white font-serif mb-1 group-hover:text-red-400 transition-colors">
                  {item.name}
                </h3>

                {/* Date */}
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{item.dateStr}</span>
                </p>

                {/* Details snippet */}
                {item.details?.mensagem && (
                  <p className="text-xs text-zinc-300 italic line-clamp-2">
                    {item.details.mensagem}
                  </p>
                )}
              </div>

              {/* Bottom CTA */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-zinc-400 group-hover:text-white transition-colors">
                <span>Ver Detalhes</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#16161B] border border-red-500/40 shadow-[0_0_40px_rgba(220,38,38,0.3)]">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mb-2">
              {selectedItem.name}
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Criado em: {selectedItem.dateStr}
            </p>

            {selectedItem.previewUrl && (
              <div className="w-full max-h-64 rounded-xl overflow-hidden bg-black border border-white/10 mb-6 flex items-center justify-center">
                <img
                  src={selectedItem.previewUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {selectedItem.details && (
              <div className="space-y-2 text-xs sm:text-sm text-zinc-300 mb-6 p-4 rounded-xl bg-black/40 border border-white/5">
                {selectedItem.details.nascimento && (
                  <p><strong className="text-white">Nascimento:</strong> {selectedItem.details.nascimento}</p>
                )}
                {selectedItem.details.falecimento && (
                  <p><strong className="text-white">Falecimento:</strong> {selectedItem.details.falecimento}</p>
                )}
                {selectedItem.details.velorio && (
                  <p><strong className="text-white">Velório:</strong> {selectedItem.details.velorio}</p>
                )}
                {selectedItem.details.sepultamento && (
                  <p><strong className="text-white">Sepultamento:</strong> {selectedItem.details.sepultamento}</p>
                )}
                {selectedItem.details.mensagem && (
                  <p className="italic pt-2 border-t border-white/10 text-zinc-400">
                    {selectedItem.details.mensagem}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
