import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Download, 
  Eye, 
  Check, 
  Sliders, 
  Layout, 
  Layers, 
  Feather,
  Sun,
  Shield,
  Palette
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
    // Draw canvas export
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

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('artes-submenu')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-tactile text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all cursor-pointer font-sans"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span>Voltar para Formatos</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 font-sans shadow-sm">
          <Palette className="w-3.5 h-3.5 text-white" />
          <span>Galeria de Templates Oficiais</span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="mb-2">
          <BlurText
            text="Templates Oficiais em Alta Definição"
            delay={60}
            animateBy="words"
            direction="top"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans inline-block"
          />
        </div>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 font-sans max-w-2xl">
          Escolha um template nobre, preencha os dados e enquadre a foto com gestos de toque na tela. Você pode baixar em alta resolução imediatamente.
        </p>
      </div>

      {/* Layout Split: Left Editor (Form & Templates) | Right Live Canvas Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Template Picker & Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Format Tabs (All / Feed 3:4 / Stories 9:16) */}
          <div className="flex items-center gap-2 p-1 bg-[#121215] border border-white/10 rounded-xl w-fit">
            <button
              onClick={() => setActiveRatioFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRatioFilter === 'all' 
                  ? 'bg-white text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos os Formatos
            </button>
            <button
              onClick={() => setActiveRatioFilter('3:4')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRatioFilter === '3:4' 
                  ? 'bg-white text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Feed (3:4)
            </button>
            <button
              onClick={() => setActiveRatioFilter('9:16')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRatioFilter === '9:16' 
                  ? 'bg-white text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Stories (9:16)
            </button>
          </div>

          {/* Template Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTemplates.map((tmpl) => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-[#18181E] border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.08)]' 
                      : 'bg-[#121215] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                        {tmpl.tag}
                      </span>
                      {isSelected && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-black">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5">{tmpl.name}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">{tmpl.description}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/5 text-[11px] text-zinc-400">
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: tmpl.themeColor }} />
                    <span>Tema Solene</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Inputs Card */}
          <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-white" />
              <span>Informações da Homenagem</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  placeholder="Ex: Maria de Lourdes Santos"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Datas (Nascimento e Falecimento)</label>
                <input
                  type="text"
                  value={datas}
                  onChange={(e) => setDatas(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  placeholder="★ 00/00/0000   ✦   ✝ 00/00/0000"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Mensagem ou Frase de Conforto</label>
                <textarea
                  rows={2}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30 resize-none"
                  placeholder="Frase em memória do ente querido..."
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Cerimônia e Despedida (Opcional)</label>
                <input
                  type="text"
                  value={cerimonia}
                  onChange={(e) => setCerimonia(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  placeholder="Ex: Velório: Capela Memorial • Sepultamento: 16h30"
                />
              </div>

              {/* Photo Input Button */}
              <div className="pt-2 flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-xl btn-tactile text-xs sm:text-sm font-semibold text-white cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-white" />
                  <span>{photoUrl ? 'Alterar & Reajustar Foto' : 'Adicionar Foto com Ajuste Touch'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {photoUrl && (
                  <button
                    onClick={() => setPhotoUrl(null)}
                    className="px-3.5 h-11 rounded-xl btn-tactile text-xs text-zinc-400 hover:text-white"
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
              className={`w-full mx-auto relative rounded-3xl border overflow-hidden p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 ${
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
                  className="text-[10px] sm:text-xs font-bold tracking-widest uppercase"
                  style={{ color: selectedTemplate.themeColor }}
                >
                  {selectedTemplate.accentText}
                </span>
                <h2 className="text-lg sm:text-2xl font-extrabold text-white mt-3 tracking-tight">
                  {nome || 'Nome do Homenageado'}
                </h2>
                <p 
                  className="text-xs sm:text-sm font-semibold mt-1"
                  style={{ color: selectedTemplate.themeColor }}
                >
                  {datas}
                </p>
              </div>

              {/* Center Portrait / Dove */}
              <div className="flex items-center justify-center my-auto relative z-10">
                <div 
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 overflow-hidden shadow-2xl flex items-center justify-center bg-[#141418]"
                  style={{ borderColor: selectedTemplate.themeColor }}
                >
                  {photoUrl ? (
                    <img 
                      src={photoUrl} 
                      alt="Homenagem" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src="/assets/dove-red-flower.svg" 
                      alt="Pomba da Paz com Flor" 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
                    />
                  )}
                </div>
              </div>

              {/* Bottom Message & Ceremony */}
              <div className="text-center space-y-3 relative z-10 pb-2">
                <p className="text-xs sm:text-sm text-zinc-300 italic px-2 leading-relaxed">
                  {mensagem}
                </p>
                {cerimonia && (
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-medium text-white">
                    {cerimonia}
                  </div>
                )}
              </div>
            </div>

            {/* Action Download Button */}
            <button
              onClick={handleDownloadArt}
              disabled={isExporting}
              className="w-full py-4 rounded-xl btn-tactile-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4 text-black" />
              <span>{isExporting ? 'Renderizando Arte...' : 'Baixar Arte em Alta Definição'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
