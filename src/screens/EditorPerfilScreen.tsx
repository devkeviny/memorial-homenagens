import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Sliders, 
  Image as ImageIcon, 
  Check, 
  Bookmark,
  Layers,
  ArrowRight,
  Move,
  ZoomIn,
  Sparkles
} from 'lucide-react';
import { ScreenId, HistoryItem } from '../types';
import BlurText from '../components/BlurText/BlurText';
import { ImageTouchModal } from '../components/ImageTouchModal';

interface EditorPerfilScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export type FrameType = 'laco-preto' | 'ouro-solene' | 'prata-solene' | 'rosas-brancas';
export type FilterType = 'pb' | 'sepia' | 'original';

interface FrameOption {
  id: FrameType;
  label: string;
  name: string;
  tag: string;
  description: string;
  themeColor: string;
  borderColor: string;
  bgGradient: string;
}

const FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'laco-preto',
    label: 'LAÇO PRETO OFICIAL',
    name: 'Laço Preto Oficial',
    tag: 'Clássico Luto',
    description: 'Moldura de respeito fúnebre com aro sóbrio e laço preto com fita de honra.',
    themeColor: '#DC2626',
    borderColor: 'rgba(220, 38, 38, 0.6)',
    bgGradient: 'from-[#14141a] via-[#0d0d12] to-[#08080a]'
  },
  {
    id: 'ouro-solene',
    label: 'FILETE DOURADO',
    name: 'Filete Dourado',
    tag: 'Ouro Nobre',
    description: 'Bordas nobres com duplo filete em ouro metálico acetinado e reverência solene.',
    themeColor: '#D4AF37',
    borderColor: 'rgba(212, 175, 55, 0.6)',
    bgGradient: 'from-[#1a1708] via-[#0f0e07] to-[#08080a]'
  },
  {
    id: 'prata-solene',
    label: 'PRATA SOLENE',
    name: 'Prata Solene',
    tag: 'Prata Acetinada',
    description: 'Filetes metálicos refinados em prata pura e acabamento sereno e moderno.',
    themeColor: '#E4E4E7',
    borderColor: 'rgba(228, 228, 231, 0.5)',
    bgGradient: 'from-[#18181f] via-[#111116] to-[#08080a]'
  },
  {
    id: 'rosas-brancas',
    label: 'ROSAS BRANCAS',
    name: 'Rosas Brancas',
    tag: 'Paz Eterna',
    description: 'Moldura alva celestial com símbolo da pomba da paz e condolências.',
    themeColor: '#FFFFFF',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    bgGradient: 'from-[#1a1c24] via-[#10121a] to-[#08080a]'
  }
];

export const EditorPerfilScreen: React.FC<EditorPerfilScreenProps> = ({ onNavigate }) => {
  // Navigation & View Mode ('gallery' | 'customize')
  const [viewMode, setViewMode] = useState<'gallery' | 'customize'>(() => {
    return window.location.hash.includes('customizar') || window.location.hash.includes('ajuste')
      ? 'customize'
      : 'gallery';
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rawPhotoToCrop, setRawPhotoToCrop] = useState<string | null>(null);
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
  const doveImageRef = useRef<HTMLImageElement | null>(null);

  const currentFrameObj = FRAME_OPTIONS.find((f) => f.id === frame) || FRAME_OPTIONS[0];

  // Sync hash changes with viewMode
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#foto-perfil-customizar' || hash === '#foto-perfil-ajuste') {
        setViewMode('customize');
      } else if (hash === '#foto-perfil' || hash === '#editor-perfil') {
        setViewMode('gallery');
      }
    };
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const handleGoToCustomize = (selectedFrame?: FrameType) => {
    if (selectedFrame) {
      setFrame(selectedFrame);
    }
    setViewMode('customize');
    window.location.hash = '#foto-perfil-customizar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGallery = () => {
    setViewMode('gallery');
    window.location.hash = '#foto-perfil';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Preload official dove SVG and generate placeholder sample on mount
  useEffect(() => {
    const doveImg = new Image();
    doveImg.onload = () => {
      doveImageRef.current = doveImg;
      renderCanvas();
    };
    doveImg.src = '/assets/dove-red-flower.svg';

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

  // Handle image upload from disk
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Open touch cropping modal for square 1:1 framing
        setRawPhotoToCrop(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update canvas when photo or controls change
  useEffect(() => {
    renderCanvas();
  }, [imageSrc, frame, filter, zoom, panX, panY, badgeText, nameText, datesText]);

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
      const aspect = img.width / img.height;
      let drawW = size * zoom;
      let drawH = (size / aspect) * zoom;
      if (drawH < size * zoom) {
        drawH = size * zoom;
        drawW = size * aspect * zoom;
      }
      const drawX = (size - drawW) / 2 + panX;
      const drawY = (size - drawH) / 2 + panY;

      // Filter settings
      if (filter === 'pb') {
        ctx.filter = 'grayscale(100%) contrast(110%) brightness(95%)';
      } else if (filter === 'sepia') {
        ctx.filter = 'sepia(85%) contrast(105%) brightness(90%)';
      } else {
        ctx.filter = 'none';
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.filter = 'none';
    }

    // Vignette gradient inside photo
    const grad = ctx.createRadialGradient(
      size / 2, size / 2, size * 0.25,
      size / 2, size / 2, size * 0.5
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    // Draw decorative border frames
    ctx.save();
    if (frame === 'ouro-solene') {
      // Golden Double Ring
      ctx.lineWidth = 14;
      const goldGrad = ctx.createLinearGradient(0, 0, size, size);
      goldGrad.addColorStop(0, '#D4AF37');
      goldGrad.addColorStop(0.5, '#F7E7A9');
      goldGrad.addColorStop(1, '#997A15');
      ctx.strokeStyle = goldGrad;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 35, 0, Math.PI * 2);
      ctx.stroke();
    } else if (frame === 'prata-solene') {
      // Silver Double Ring
      ctx.lineWidth = 14;
      const silverGrad = ctx.createLinearGradient(0, 0, size, size);
      silverGrad.addColorStop(0, '#A1A1AA');
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
      if (doveImageRef.current && doveImageRef.current.complete) {
        ctx.drawImage(doveImageRef.current, size / 2 - 32, 42, 64, 64);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PAZ', size / 2, 72);
      }
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
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in select-none font-sans">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Image Touch Modal for 1:1 square circular crop */}
      <ImageTouchModal
        isOpen={Boolean(rawPhotoToCrop)}
        imageSrc={rawPhotoToCrop || ''}
        aspectRatio={1}
        title="Ajustar Foto do Perfil"
        onConfirm={(cropped) => {
          setImageSrc(cropped);
          const img = new Image();
          img.onload = () => {
            loadedImageRef.current = img;
            renderCanvas();
          };
          img.src = cropped;
          setRawPhotoToCrop(null);
        }}
        onClose={() => setRawPhotoToCrop(null)}
      />

      {/* ========================================================================= */}
      {/* VIEW 1: UGC BUILDER VISUAL GALLERY (Select frame)                         */}
      {/* ========================================================================= */}
      {viewMode === 'gallery' ? (
        <div className="flex flex-col flex-1">
          {/* Top Bar with Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-3 border-b border-white/5">
            <button
              onClick={() => onNavigate('artes-submenu')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl btn-tactile text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer font-sans"
            >
              <ArrowLeft className="w-4 h-4 text-red-400" />
              <span>Voltar para Formatos</span>
            </button>

            {/* Interactive Breadcrumb */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium bg-zinc-900/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={handleBackToGallery}
                className="px-3 py-1 rounded-lg transition-all cursor-pointer bg-white/15 text-white font-bold shadow-sm"
              >
                1. Estilos
              </button>
              <span className="text-zinc-600">/</span>
              <button
                type="button"
                onClick={() => handleGoToCustomize()}
                className="px-3 py-1 rounded-lg transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-white/5"
              >
                2. Personalização
              </button>
            </nav>
          </div>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16161B] border border-white/10 text-zinc-300 text-xs font-semibold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Molduras Solenes</span>
            </div>

            <div className="mb-2">
              <BlurText
                text="Selecione o estilo que você quer"
                delay={50}
                animateBy="words"
                direction="top"
                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans inline-block"
              />
            </div>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Escolha a moldura de respeito para foto de perfil do WhatsApp e redes sociais
            </p>
          </div>

          {/* UGC Frame Gallery Grid (4 columns desktop, 2 columns mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
            {FRAME_OPTIONS.map((f) => {
              const isSelected = frame === f.id;

              return (
                <div
                  key={f.id}
                  onClick={() => setFrame(f.id)}
                  onDoubleClick={() => handleGoToCustomize(f.id)}
                  className={`group relative rounded-[24px] cursor-pointer transition-all duration-300 select-none overflow-hidden aspect-square ${
                    isSelected
                      ? 'border-[3px] border-white shadow-[0_0_28px_rgba(255,255,255,0.45)] ring-2 ring-white/25 scale-[1.01]'
                      : 'border-[3px] border-transparent hover:border-white/25 bg-zinc-900/60 shadow-xl'
                  }`}
                >
                  {/* Clean Visual Mockup of the Frame */}
                  <div className="relative w-full h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
                    {/* Background solemn gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${f.bgGradient} pointer-events-none`} />

                    {/* Radial Glow */}
                    <div
                      className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-35"
                      style={{ backgroundColor: f.themeColor }}
                    />

                    {/* Circular Mockup in Center */}
                    <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                      <div
                        className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center bg-black/80 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                        style={{
                          boxShadow: `0 0 25px ${f.borderColor}`
                        }}
                      >
                        {/* Outer Frame Mockup Ring */}
                        {f.id === 'ouro-solene' && (
                          <div className="absolute inset-1 rounded-full border-[5px] border-[#D4AF37] border-double" />
                        )}
                        {f.id === 'prata-solene' && (
                          <div className="absolute inset-1 rounded-full border-[5px] border-[#E4E4E7]" />
                        )}
                        {f.id === 'rosas-brancas' && (
                          <div className="absolute inset-1 rounded-full border-[6px] border-white/80" />
                        )}
                        {f.id === 'laco-preto' && (
                          <>
                            <div className="absolute inset-0.5 rounded-full border-[6px] border-[#1E1E24]" />
                            <div className="absolute inset-2.5 rounded-full border-2 border-red-600" />
                          </>
                        )}

                        {/* Silhouette / Dove center */}
                        {f.id === 'rosas-brancas' ? (
                          <img
                            src="/assets/dove-red-flower.svg"
                            alt="Paz"
                            className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-800/90 flex items-center justify-center text-zinc-500">
                            <span className="text-xl sm:text-2xl font-bold opacity-40">RIP</span>
                          </div>
                        )}

                        {/* Mourning ribbon badge mockup for laco-preto and ouro-solene */}
                        {(f.id === 'laco-preto' || f.id === 'ouro-solene') && (
                          <div className="absolute bottom-1 right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-zinc-950 border border-white/40 flex items-center justify-center shadow-lg">
                            <span className="text-[10px] text-white font-bold">🎗</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Top Right Format Tag Badge */}
                    <div className="absolute top-3.5 right-3.5 z-20">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-black/70 border border-white/15 text-zinc-300 backdrop-blur-md">
                        {f.tag}
                      </span>
                    </div>

                    {/* Bottom Left Discreet Uppercase Label (Mandatory UGC style) */}
                    <div className="absolute bottom-3.5 left-3.5 z-20">
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/15 text-xs font-black tracking-wider text-white uppercase shadow-lg">
                        {f.label}
                      </span>
                    </div>

                    {/* Top Left Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-3.5 left-3.5 z-20 w-7 h-7 rounded-full bg-white text-zinc-950 border border-white/50 flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Action Bar with Highlighted Next Button */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#101014]/95 backdrop-blur-xl border-t border-white/10 px-4 sm:px-8 py-3.5 shadow-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: currentFrameObj.themeColor }}
                />
                <div className="text-xs sm:text-sm text-zinc-300">
                  <span>Estilo selecionado: </span>
                  <span className="font-bold text-white">{currentFrameObj.name}</span>
                  <span className="text-zinc-500 ml-1.5 hidden sm:inline">({currentFrameObj.tag})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGoToCustomize()}
                  className="btn-tactile-white font-bold px-6 sm:px-8 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm sm:text-base cursor-pointer hover:bg-zinc-200 active:scale-95 transition-all text-zinc-950"
                >
                  <span>Avançar para Personalizar</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: CUSTOMIZE & TOUCH EDIT STAGE                                      */
        /* ========================================================================= */
        <div className="flex flex-col flex-1 animate-fade-in">
          {/* Top Bar with Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-3 border-b border-white/5">
            <button
              onClick={handleBackToGallery}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl btn-tactile text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer font-sans"
            >
              <ArrowLeft className="w-4 h-4 text-red-400" />
              <span>← Voltar aos Estilos</span>
            </button>

            {/* Interactive Breadcrumb */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium bg-zinc-900/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={handleBackToGallery}
                className="px-3 py-1 rounded-lg transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-white/5"
              >
                1. Estilos
              </button>
              <span className="text-zinc-600">/</span>
              <button
                type="button"
                className="px-3 py-1 rounded-lg transition-all cursor-pointer bg-white/15 text-white font-bold shadow-sm"
              >
                2. Personalização
              </button>
            </nav>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Personalizar Foto de Perfil
            </h1>
            <p className="mt-1 text-sm sm:text-base text-zinc-400">
              Faça o upload da foto, ajuste o enquadramento touch e personalize os detalhes da homenagem.
            </p>
          </div>

          {/* Main Grid: Live Canvas Preview + Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Left Col: Live Preview Canvas (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-3xl bg-[#16161B]/90 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_30px_rgba(220,38,38,0.2)] bg-black mb-6">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col w-full gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl btn-tactile text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer font-sans"
                >
                  <Upload className="w-4 h-4 text-red-400" />
                  <span>Carregar Outra Foto</span>
                </button>

                {imageSrc && (
                  <button
                    type="button"
                    onClick={() => setRawPhotoToCrop(imageSrc)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl btn-tactile text-zinc-300 hover:text-white text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer font-sans"
                  >
                    <Move className="w-4 h-4 text-red-400" />
                    <span>Ajustar Enquadramento Touch</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl btn-tactile-red text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer font-sans"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Foto Pronta (PNG 1080px)</span>
                </button>

                <button
                  type="button"
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
                  {FRAME_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrame(f.id)}
                      className={`p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer font-sans ${
                        frame === f.id
                          ? 'btn-tactile-red text-white'
                          : 'btn-tactile text-zinc-400 hover:text-white'
                      }`}
                    >
                      {f.name}
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
                      type="button"
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
                  3. Ajuste Fino de Zoom e Posição
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
      )}
    </div>
  );
};
