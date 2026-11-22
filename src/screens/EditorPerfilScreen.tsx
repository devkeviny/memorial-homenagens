import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  RotateCcw, 
  Sliders, 
  Image as ImageIcon, 
  Check, 
  User, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import { ScreenId, HistoryItem } from '../types';
import BlurText from '../components/BlurText/BlurText';

interface EditorPerfilScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

type FrameType = 'laco-preto' | 'ouro-solene' | 'prata-solene' | 'rosas-brancas';
type FilterType = 'pb' | 'sepia' | 'original';

export const EditorPerfilScreen: React.FC<EditorPerfilScreenProps> = ({ onNavigate }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [frame, setFrame] = useState<FrameType>('laco-preto');
  const [filter, setFilter] = useState<FilterType>('pb');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [badgeText, setBadgeText] = useState('LUTO');
  const [nameText, setNameText] = useState('');
  const [datesText, setDatesText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  // Default sample image if none uploaded yet
  useEffect(() => {
    // Generate placeholder sample on mount
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1C1C24';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#2A2A36';
      ctx.beginPath();
      ctx.arc(200, 160, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(200, 360, 130, 0, Math.PI * 2);
      ctx.fill();
      const img = new Image();
      img.onload = () => {
        loadedImageRef.current = img;
        renderCanvas();
      };
      img.src = canvas.toDataURL();
      setImageSrc(canvas.toDataURL());
    }
  }, []);

  // Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        const img = new Image();
        img.onload = () => {
          loadedImageRef.current = img;
          renderCanvas();
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-render canvas whenever controls change
  useEffect(() => {
    renderCanvas();
  }, [frame, filter, zoom, panX, panY, badgeText, nameText, datesText]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // Background fill
    ctx.fillStyle = '#0C0C0F';
    ctx.fillRect(0, 0, size, size);

    // Circular clip path for profile photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 20, 0, Math.PI * 2);
    ctx.clip();

    // Draw user photo with zoom & pan
    if (loadedImageRef.current) {
      const img = loadedImageRef.current;

      // Filter styling
      if (filter === 'pb') {
        ctx.filter = 'grayscale(100%) contrast(115%) brightness(95%)';
      } else if (filter === 'sepia') {
        ctx.filter = 'sepia(80%) contrast(105%) brightness(90%)';
      } else {
        ctx.filter = 'contrast(105%) brightness(100%)';
      }

      const imgAspect = img.width / img.height;
      let drawW = size * zoom;
      let drawH = (size / imgAspect) * zoom;
      if (drawH < size * zoom) {
        drawH = size * zoom;
        drawW = size * imgAspect * zoom;
      }

      const drawX = (size - drawW) / 2 + panX;
      const drawY = (size - drawH) / 2 + panY;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.filter = 'none';
    }

    // Vignette shade over bottom of circle for text legibility
    const grad = ctx.createLinearGradient(0, size * 0.6, 0, size);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, size * 0.6, size, size * 0.4);

    ctx.restore();

    // Draw Frame / Border
    ctx.save();
    if (frame === 'ouro-solene') {
      ctx.lineWidth = 24;
      const goldGrad = ctx.createLinearGradient(0, 0, size, size);
      goldGrad.addColorStop(0, '#D4AF37');
      goldGrad.addColorStop(0.5, '#FFF2B2');
      goldGrad.addColorStop(1, '#997A15');
      ctx.strokeStyle = goldGrad;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 20, 0, Math.PI * 2);
      ctx.stroke();

      // Inner thin ring
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 38, 0, Math.PI * 2);
      ctx.stroke();
    } else if (frame === 'prata-solene') {
      ctx.lineWidth = 24;
      const silverGrad = ctx.createLinearGradient(0, 0, size, size);
      silverGrad.addColorStop(0, '#A0A0A5');
      silverGrad.addColorStop(0.5, '#FFFFFF');
      silverGrad.addColorStop(1, '#6E6E73');
      ctx.strokeStyle = silverGrad;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 20, 0, Math.PI * 2);
      ctx.stroke();
    } else if (frame === 'rosas-brancas') {
      ctx.lineWidth = 20;
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 20, 0, Math.PI * 2);
      ctx.stroke();

      // Rose accent markers
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🕊️', size / 2, 70);
    } else {
      // Classic Dark Solemn Ring
      ctx.lineWidth = 22;
      ctx.strokeStyle = '#1E1E24';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 20, 0, Math.PI * 2);
      ctx.stroke();

      // Red solemn accent rim
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 33, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Draw Mourning Ribbon (Laço de Luto Preto) in lower corner
    if (frame === 'laco-preto' || frame === 'ouro-solene') {
      ctx.save();
      const rx = size * 0.78;
      const ry = size * 0.78;

      ctx.fillStyle = '#111111';
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;

      // Ribbon loop 1
      ctx.beginPath();
      ctx.ellipse(rx - 15, ry - 15, 30, 16, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ribbon loop 2
      ctx.beginPath();
      ctx.ellipse(rx + 15, ry - 15, 30, 16, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ribbon tails
      ctx.beginPath();
      ctx.moveTo(rx - 8, ry);
      ctx.lineTo(rx - 25, ry + 40);
      ctx.lineTo(rx - 12, ry + 36);
      ctx.lineTo(rx, ry + 5);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rx + 8, ry);
      ctx.lineTo(rx + 25, ry + 40);
      ctx.lineTo(rx + 12, ry + 36);
      ctx.lineTo(rx, ry + 5);
      ctx.fill();
      ctx.stroke();

      // Knot center
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(rx, ry - 10, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Text Overlays on Canvas
    ctx.save();
    ctx.textAlign = 'center';

    // Badge text (ex: LUTO / SAUDADES ETERNAS)
    if (badgeText) {
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 12;
      ctx.fillText(badgeText, size / 2, size - 140);
    }

    // Name text
    if (nameText) {
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#F3F4F6';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 10;
      ctx.fillText(nameText, size / 2, size - 95);
    }

    // Dates text
    if (datesText) {
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 8;
      ctx.fillText(datesText, size / 2, size - 60);
    }
    ctx.restore();
  };

  // Download Profile Photo
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `foto-perfil-luto-${(nameText || 'memorial').toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Save to Local History
  const handleSaveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');

    const item: HistoryItem = {
      id: `hist_profile_${Date.now()}`,
      type: 'foto-perfil',
      name: nameText || 'Foto de Perfil com Luto',
      dateStr: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      timestamp: Date.now(),
      previewUrl: url,
      details: {
        mensagem: badgeText,
        falecimento: datesText
      }
    };

    try {
      const existing = localStorage.getItem('memorial_historico');
      const list: HistoryItem[] = existing ? JSON.parse(existing) : [];
      list.unshift(item);
      localStorage.setItem('memorial_historico', JSON.stringify(list));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error('Error saving profile photo to history:', e);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in select-none">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('artes-submenu')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16161B]/80 hover:bg-[#1C1C24] border border-white/10 hover:border-red-500/40 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-red-400" />
          <span>Voltar para Formatos de Arte</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2">
          <BlurText
            text="Moldura de Luto para Foto de Perfil"
            delay={60}
            animateBy="words"
            direction="top"
            className="text-2xl sm:text-4xl font-bold text-white font-sans tracking-tight inline-block"
          />
        </div>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">
          Personalize a foto do ente querido com moldura de respeito, laço preto e efeito preto e branco para WhatsApp e redes.
        </p>
      </div>

      {/* Main Grid: Live Canvas Preview + Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Live Preview Canvas (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-3xl bg-[#16161B]/90 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_30px_rgba(220,38,38,0.2)] bg-black mb-6">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col w-full gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl btn-tactile text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer font-sans"
            >
              <Upload className="w-4 h-4 text-red-400" />
              <span>Carregar Foto da Galeria</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl btn-tactile-red text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer font-sans"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Foto Pronta (PNG 1080px)</span>
            </button>

            <button
              onClick={handleSaveToHistory}
              disabled={isSaved}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl btn-tactile text-zinc-300 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer font-sans"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Salvo no Histórico</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-zinc-400" />
                  <span>Salvar no Histórico Local</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Customization Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-[#16161B]/90 border border-white/10 card-tactile">
          {/* Section 1: Estilo de Moldura */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-3 font-sans">
              1. Moldura de Homenagem
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-sans">
              {[
                { id: 'laco-preto', label: 'Laço de Luto' },
                { id: 'ouro-solene', label: 'Ouro Solene' },
                { id: 'prata-solene', label: 'Prata Fina' },
                { id: 'rosas-brancas', label: 'Paz Eterna' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFrame(f.id as FrameType)}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer font-sans ${
                    frame === f.id
                      ? 'btn-tactile-red text-white'
                      : 'btn-tactile text-zinc-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Filtro de Imagem */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-3 font-sans">
              2. Filtro Fotográfico
            </label>
            <div className="grid grid-cols-3 gap-2.5 font-sans">
              {[
                { id: 'pb', label: 'Preto & Branco Solene' },
                { id: 'sepia', label: 'Sépia Emotivo' },
                { id: 'original', label: 'Cor Original' }
              ].map((fil) => (
                <button
                  key={fil.id}
                  onClick={() => setFilter(fil.id as FilterType)}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer font-sans ${
                    filter === fil.id
                      ? 'btn-tactile-red text-white'
                      : 'btn-tactile text-zinc-400 hover:text-white'
                  }`}
                >
                  {fil.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Ajustes de Enquadramento (Zoom & Pan) */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <label className="block text-xs font-bold uppercase tracking-wider text-red-400">
              3. Enquadramento e Posição
            </label>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Zoom da Imagem</span>
                <span>{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#2A2A36] rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Mover Horizontal (X)</span>
                  <span>{panX}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  value={panX}
                  onChange={(e) => setPanX(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#2A2A36] rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Mover Vertical (Y)</span>
                  <span>{panY}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  value={panY}
                  onChange={(e) => setPanY(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#2A2A36] rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Textos Opcionais */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="block text-xs font-bold uppercase tracking-wider text-red-400">
              4. Textos Gravados na Foto
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-zinc-400 mb-1 block">Selo Superior</span>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="Ex: LUTO"
                  className="w-full px-3 py-2 rounded-xl bg-[#0C0C0F] border border-white/10 text-xs text-white placeholder-zinc-500 focus:border-red-500/60 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[11px] text-zinc-400 mb-1 block">Nome do Ente</span>
                <input
                  type="text"
                  value={nameText}
                  onChange={(e) => setNameText(e.target.value)}
                  placeholder="Ex: Maria Pereira"
                  className="w-full px-3 py-2 rounded-xl bg-[#0C0C0F] border border-white/10 text-xs text-white placeholder-zinc-500 focus:border-red-500/60 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[11px] text-zinc-400 mb-1 block">Anos / Datas</span>
                <input
                  type="text"
                  value={datesText}
                  onChange={(e) => setDatesText(e.target.value)}
                  placeholder="Ex: 1948 - 2026"
                  className="w-full px-3 py-2 rounded-xl bg-[#0C0C0F] border border-white/10 text-xs text-white placeholder-zinc-500 focus:border-red-500/60 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
