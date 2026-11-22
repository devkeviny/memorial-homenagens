import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Download, 
  Sliders, 
  Palette,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Move
} from 'lucide-react';
import { ScreenId } from '../types';
import { ImageTouchModal } from '../components/ImageTouchModal';
import BlurText from '../components/BlurText/BlurText';

interface TemplatesArtesScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export interface ArtTemplate {
  id: string;
  name: string;
  tag: string;
  ratio: '3:4' | '9:16';
  description: string;
  themeColor: string;
  borderColor: string;
  bgStyle: string;
  accentText: string;
}

const TEMPLATES: ArtTemplate[] = [
  {
    id: 'gold-classic-feed',
    name: 'Solene Clássico Dourado',
    tag: 'Feed 3:4',
    ratio: '3:4',
    description: 'Moldura dupla em filete dourado fino, degradê ébano suave e tipografia nobre.',
    themeColor: '#D4AF37',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    bgStyle: 'from-[#141418] via-[#0D0D10] to-[#08080A]',
    accentText: '★ EM MEMÓRIA E ETERNA SAUDADE ✝'
  },
  {
    id: 'candle-light-story',
    name: 'Luz de Vela Noturna',
    tag: 'Stories 9:16',
    ratio: '9:16',
    description: 'Aura suave e acolhedora com iluminação quente sutil e linhas minimalistas.',
    themeColor: '#FFFFFF',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    bgStyle: 'from-[#1A1817] via-[#100F0F] to-[#080808]',
    accentText: '✦ QUE BRILHE A LUZ ETERNA ✦'
  },
  {
    id: 'silver-minimal-feed',
    name: 'Prata Minimalista',
    tag: 'Feed 3:4',
    ratio: '3:4',
    description: 'Linhas finas em prata polida, respiro visual generoso e sobriedade contemporânea.',
    themeColor: '#E4E4E7',
    borderColor: 'rgba(228, 228, 231, 0.3)',
    bgStyle: 'from-[#161619] via-[#0E0E12] to-[#08080A]',
    accentText: 'COM CARINHO E GRATIDÃO'
  },
  {
    id: 'rose-whisper-story',
    name: 'Rosa Solene & Pétalas',
    tag: 'Stories 9:16',
    ratio: '9:16',
    description: 'Destaque sutil com acento vermelho escarlate fúnebre nas bordas e nas homenagens.',
    themeColor: '#EF4444',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    bgStyle: 'from-[#1C1416] via-[#100B0D] to-[#080506]',
    accentText: 'ETERNAMENTE EM NOSSOS CORAÇÕES'
  }
];

export const TemplatesArtesScreen: React.FC<TemplatesArtesScreenProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'gallery' | 'customize'>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<ArtTemplate>(TEMPLATES[0]);
  const [activeRatioFilter, setActiveRatioFilter] = useState<'all' | '3:4' | '9:16'>('all');
  
  // Customization Form State
  const [nome, setNome] = useState('Maria de Lourdes Santos');
  const [datas, setDatas] = useState('★ 14/05/1948   ✦   ✝ 21/11/2026');
  const [mensagem, setMensagem] = useState('“Aqueles que amamos nunca morrem, apenas partem antes de nós e deixam viva a sua luz.”');
  const [cerimonia, setCerimonia] = useState('Velório: Capela Memorial • Sepultamento: 16h30');
  
  // Photo State
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [rawPhotoToCrop, setRawPhotoToCrop] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const filteredTemplates = TEMPLATES.filter(t => {
    if (activeRatioFilter === 'all') return true;
    return t.ratio === activeRatioFilter;
  });

  const currentIndex = TEMPLATES.findIndex(t => t.id === selectedTemplate.id);

  const handlePrevTemplate = () => {
    const prevIdx = (currentIndex - 1 + TEMPLATES.length) % TEMPLATES.length;
    setSelectedTemplate(TEMPLATES[prevIdx]);
  };

  const handleNextTemplate = () => {
    const nextIdx = (currentIndex + 1) % TEMPLATES.length;
    setSelectedTemplate(TEMPLATES[nextIdx]);
  };

  const handleSelectAndCustomize = (template: ArtTemplate) => {
    setSelectedTemplate(template);
    setViewMode('customize');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawPhotoToCrop(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownloadArt = () => {
    setIsExporting(true);
    const width = selectedTemplate.ratio === '3:4' ? 1080 : 1080;
    const height = selectedTemplate.ratio === '3:4' ? 1440 : 1920;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#09090B';
    ctx.fillRect(0, 0, width, height);

    // Frame Border
    ctx.strokeStyle = selectedTemplate.borderColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(65, 65, width - 130, height - 130);

    // Top Accent
    ctx.fillStyle = selectedTemplate.themeColor;
    ctx.textAlign = 'center';
    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(selectedTemplate.accentText, width / 2, 160);

    // Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 60px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(nome || 'Nome do Homenageado', width / 2, height * 0.28);

    // Dates
    ctx.fillStyle = selectedTemplate.themeColor;
    ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(datas || '', width / 2, height * 0.34);

    // Draw photo or placeholder
    const photoSize = 360;
    const photoY = height * 0.52;

    const finalizeAndDownload = () => {
      // Message
      ctx.fillStyle = '#E4E4E7';
      ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(mensagem || '', width / 2, height * 0.74);

      // Ceremony
      if (cerimonia) {
        ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
        ctx.fillRect(100, height - 230, width - 200, 120);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, height - 230, width - 200, 120);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(cerimonia, width / 2, height - 160);
      }

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `arte-${selectedTemplate.id}-${Date.now()}.png`;
      a.click();
      setIsExporting(false);
    };

    if (photoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, photoY, photoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, (width / 2) - photoSize / 2, photoY - photoSize / 2, photoSize, photoSize);
        ctx.restore();
        
        ctx.beginPath();
        ctx.arc(width / 2, photoY, photoSize / 2, 0, Math.PI * 2);
        ctx.strokeStyle = selectedTemplate.themeColor;
        ctx.lineWidth = 6;
        ctx.stroke();

        finalizeAndDownload();
      };
      img.onerror = () => finalizeAndDownload();
      img.src = photoUrl;
    } else {
      finalizeAndDownload();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-fade-in font-sans">
      {/* Touch modal for cropping user image */}
      <ImageTouchModal
        isOpen={Boolean(rawPhotoToCrop)}
        imageSrc={rawPhotoToCrop || ''}
        onConfirm={(cropped) => {
          setPhotoUrl(cropped);
          setRawPhotoToCrop(null);
        }}
        onClose={() => setRawPhotoToCrop(null)}
      />

      {/* Breadcrumb Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
        <nav aria-label="Trilha de Navegação" className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 font-sans">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Início
          </button>
          <span>/</span>
          <button 
            onClick={() => onNavigate('artes-submenu')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Criar Postagens
          </button>
          <span>/</span>
          {viewMode === 'gallery' ? (
            <span className="text-white font-medium">Galeria de Templates</span>
          ) : (
            <>
              <button 
                onClick={() => setViewMode('gallery')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Galeria
              </button>
              <span>/</span>
              <span className="text-white font-medium">{selectedTemplate.name}</span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {viewMode === 'customize' && (
            <button
              onClick={() => setViewMode('gallery')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl btn-tactile text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver todos os modelos</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 font-sans shadow-sm">
            <Palette className="w-3.5 h-3.5 text-white" />
            <span>Formatos Oficiais</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: VITRINE / PÁGINA DE NAVEGAÇÃO ENTRE OS TEMPLATES      */}
      {/* ============================================================== */}
      {viewMode === 'gallery' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <div className="mb-2">
              <BlurText
                text="Templates Oficiais em Alta Definição"
                delay={60}
                animateBy="words"
                direction="top"
                className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans inline-block"
              />
            </div>
            <p className="mt-2 text-base sm:text-lg text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Selecione o modelo desejado para acessar a tela de customização com preview ao vivo e enquadramento touch da foto.
            </p>
          </div>

          {/* Format Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-[#121215] border border-white/10 rounded-2xl w-fit">
            <button
              onClick={() => setActiveRatioFilter('all')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeRatioFilter === 'all' 
                  ? 'bg-white text-zinc-950 shadow-md font-bold' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos os Formatos ({TEMPLATES.length})
            </button>
            <button
              onClick={() => setActiveRatioFilter('3:4')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeRatioFilter === '3:4' 
                  ? 'bg-white text-zinc-950 shadow-md font-bold' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Feed (3:4)
            </button>
            <button
              onClick={() => setActiveRatioFilter('9:16')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeRatioFilter === '9:16' 
                  ? 'bg-white text-zinc-950 shadow-md font-bold' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Stories (9:16)
            </button>
          </div>

          {/* Templates Grid Cards (Design Bento & Visual Rico) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredTemplates.map((tmpl) => (
              <motion.div
                key={tmpl.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectAndCustomize(tmpl)}
                className="relative group flex flex-col justify-between p-7 sm:p-9 rounded-[28px] bg-gradient-to-b from-[#181822] via-[#121218] to-[#0D0D12] border border-white/10 hover:border-white/25 shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer overflow-hidden card-tactile"
              >
                {/* Subtle Glow */}
                <div 
                  className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity" 
                  style={{ backgroundColor: tmpl.themeColor }}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white font-sans">
                      {tmpl.tag}
                    </span>
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm" 
                        style={{ backgroundColor: tmpl.themeColor }} 
                      />
                      <span className="text-xs font-medium text-zinc-300">Tema Solene</span>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-sans tracking-tight">
                    {tmpl.name}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 font-sans">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  <span className="text-xs font-cursive text-zinc-300 italic tracking-wider">
                    {tmpl.accentText}
                  </span>

                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-950 btn-tactile-white flex items-center gap-2 font-sans shrink-0"
                  >
                    <span>Personalizar</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: TELA DEDICADA DE CUSTOMIZAÇÃO DO TEMPLATE ACESSADO     */}
      {/* ============================================================== */}
      {viewMode === 'customize' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Template Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#14141A] border border-white/10">
            <div className="flex items-center gap-3">
              <span 
                className="w-4 h-4 rounded-full border border-white/30 shadow-sm" 
                style={{ backgroundColor: selectedTemplate.themeColor }} 
              />
              <div>
                <h2 className="text-lg font-bold text-white font-sans leading-none">
                  {selectedTemplate.name}
                </h2>
                <span className="text-xs text-zinc-400 font-sans">
                  Formato: {selectedTemplate.tag}
                </span>
              </div>
            </div>

            {/* Previous / Next Template Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTemplate}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn-tactile text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer font-sans"
                title="Modelo Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
              <span className="text-xs text-zinc-400 px-2 font-medium">
                {currentIndex + 1} de {TEMPLATES.length}
              </span>
              <button
                onClick={handleNextTemplate}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn-tactile text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer font-sans"
                title="Próximo Modelo"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Customization Layout: Left Editor Inputs | Right Live Art Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Customization Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-[28px] bg-[#121217] border border-white/10 space-y-5 shadow-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-white" />
                  <span>Informações do Homenageado</span>
                </h3>

                <div className="space-y-4 text-sm font-sans">
                  <div>
                    <label className="block text-zinc-300 mb-1.5 font-medium text-xs sm:text-sm">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30 text-base"
                      placeholder="Ex: Maria de Lourdes Santos"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1.5 font-medium text-xs sm:text-sm">
                      Datas (Nascimento e Falecimento)
                    </label>
                    <input
                      type="text"
                      value={datas}
                      onChange={(e) => setDatas(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30 text-base"
                      placeholder="★ 00/00/0000   ✦   ✝ 00/00/0000"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1.5 font-medium text-xs sm:text-sm">
                      Mensagem ou Frase de Conforto
                    </label>
                    <textarea
                      rows={3}
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30 resize-none text-base"
                      placeholder="Frase em memória do ente querido..."
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1.5 font-medium text-xs sm:text-sm">
                      Cerimônia e Despedida (Opcional)
                    </label>
                    <input
                      type="text"
                      value={cerimonia}
                      onChange={(e) => setCerimonia(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30 text-base"
                      placeholder="Ex: Velório: Capela Memorial • Sepultamento: 16h30"
                    />
                  </div>

                  {/* Photo Input Button & Touch Adjustment */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 h-12 px-4 rounded-xl btn-tactile text-sm font-semibold text-white cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-white" />
                      <span>{photoUrl ? 'Substituir Foto' : 'Adicionar Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setRawPhotoToCrop(photoUrl)}
                        className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl btn-tactile text-sm font-semibold text-white cursor-pointer transition-all hover:border-white/20"
                        title="Ajuste Touch da Foto (Zoom e Posição)"
                      >
                        <Move className="w-4 h-4 text-white" />
                        <span>Ajuste Touch</span>
                      </button>
                    )}

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(null)}
                        className="px-4 h-12 rounded-xl btn-tactile text-xs text-zinc-400 hover:text-white"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Art Preview & Download (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full sticky top-6 space-y-4">
                
                {/* Live Interactive Preview Card */}
                <div 
                  className={`w-full mx-auto relative rounded-[28px] border overflow-hidden p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 ${
                    selectedTemplate.ratio === '3:4' ? 'aspect-[3/4]' : 'aspect-[9/16]'
                  }`}
                  style={{
                    borderColor: selectedTemplate.borderColor,
                    background: '#09090B'
                  }}
                >
                  {/* Internal Fine Border */}
                  <div 
                    className="absolute inset-2.5 rounded-2xl border pointer-events-none"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.09)' }}
                  />

                  {/* Header Badge */}
                  <div className="text-center pt-2 relative z-10">
                    <span 
                      className="text-[10px] sm:text-xs font-bold tracking-widest uppercase font-sans"
                      style={{ color: selectedTemplate.themeColor }}
                    >
                      {selectedTemplate.accentText}
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-white mt-3 tracking-tight font-sans">
                      {nome || 'Nome do Homenageado'}
                    </h2>
                    <p 
                      className="text-xs sm:text-sm font-semibold mt-1 font-sans"
                      style={{ color: selectedTemplate.themeColor }}
                    >
                      {datas}
                    </p>
                  </div>

                  {/* Center Portrait / Dove */}
                  <div className="flex items-center justify-center my-auto relative z-10">
                    <div 
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 overflow-hidden shadow-2xl flex items-center justify-center bg-[#141418] p-1"
                      style={{ borderColor: selectedTemplate.themeColor }}
                    >
                      {photoUrl ? (
                        <img 
                          src={photoUrl} 
                          alt="Homenagem" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <img 
                          src="/assets/dove-red-flower.svg" 
                          alt="Símbolo de Paz" 
                          className="w-16 h-16 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Bottom Message & Ceremony */}
                  <div className="text-center space-y-3 relative z-10 pb-2">
                    <p className="text-xs sm:text-sm text-zinc-300 italic px-2 leading-relaxed font-sans">
                      {mensagem}
                    </p>
                    {cerimonia && (
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-medium text-white font-sans">
                        {cerimonia}
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownloadArt}
                  disabled={isExporting}
                  className="w-full py-4 rounded-full text-base font-bold text-zinc-950 btn-tactile-white shadow-[0_0_25px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] font-sans"
                >
                  <Download className="w-5 h-5 text-zinc-950" />
                  <span>{isExporting ? 'Renderizando Arte...' : 'Baixar Arte em Alta Resolução (PNG)'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
