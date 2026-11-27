import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Download, 
  Image as ImageIcon, 
  Move, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  Loader2,
  Filter
} from 'lucide-react';
import { ScreenId, HistoryItem } from '../types';
import BlurText from '../components/BlurText/BlurText';
import { ImageTouchModal } from '../components/ImageTouchModal';
import {
  SOLEMN_TEMPLATES,
  TemplateItem,
  renderSolemnArtAsync
} from '../utils/canvasHelper';
import { saveHomenagem } from '../lib/supabase';

interface TemplatesArtesScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenPix?: () => void;
}

export const TemplatesArtesScreen: React.FC<TemplatesArtesScreenProps> = ({ 
  onNavigate 
}) => {
  // Navigation & View Mode ('gallery' | 'customize')
  const [viewMode, setViewMode] = useState<'gallery' | 'customize'>(() => {
    return window.location.hash.includes('customizar') ? 'customize' : 'gallery';
  });

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem>(SOLEMN_TEMPLATES[0]);
  const [formatFilter, setFormatFilter] = useState<'todos' | '3:4' | '9:16'>('todos');

  // Form Fields
  const [nome, setNome] = useState('João da Silva');
  const [datas, setDatas] = useState('* 15/04/1954  † 20/11/2026');
  const [mensagem, setMensagem] = useState(
    'Combati o bom combate, acabei a carreira, guardei a fé. Sua memória viverá eternamente em nossos corações com infinito amor e saudade.'
  );
  const [cerimonia, setCerimonia] = useState('Velório Municipal • Sala 02 — Sepultamento às 16h');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [rawPhotoToCrop, setRawPhotoToCrop] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync hash changes with viewMode for robust browser back/forward navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#templates-customizar') {
        setViewMode('customize');
      } else if (hash === '#templates' || hash === '#templates-artes') {
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

  const handleGoToCustomize = (template?: TemplateItem) => {
    if (template) {
      setSelectedTemplate(template);
    }
    setViewMode('customize');
    window.location.hash = 'templates-customizar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGallery = () => {
    setViewMode('gallery');
    window.location.hash = 'templates';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRawPhotoToCrop(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Render High Resolution Art to Canvas and Download (1080x1440 Feed or 1080x1920 Story with 150px safe area)
  const handleDownloadArt = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await renderSolemnArtAsync({
        ratio: selectedTemplate.ratio,
        templateId: selectedTemplate.id,
        data: {
          nome,
          nascimento: datas,
          falecimento: datas,
          velorio: cerimonia,
          sepultamento: cerimonia,
          mensagem
        },
        photoUrl,
        rawDatas: datas,
        cerimoniaRaw: cerimonia
      });

      const link = document.createElement('a');
      link.download = `homenagem-${selectedTemplate.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      // Save to Supabase and memorial_historico
      try {
        const histItem: HistoryItem = {
          id: 'arte-' + Date.now(),
          type: 'post-duplo',
          name: nome || 'Homenagem Póstuma',
          dateStr: new Date().toLocaleDateString('pt-BR'),
          timestamp: Date.now(),
          previewUrl: dataUrl,
          artRatio34Url: selectedTemplate.ratio === '3:4' ? dataUrl : undefined,
          artRatio916Url: selectedTemplate.ratio === '9:16' ? dataUrl : undefined,
          details: {
            nascimento: datas,
            mensagem: mensagem,
            velorio: cerimonia,
            sepultamento: cerimonia
          }
        };
        saveHomenagem(histItem).catch((e) => {
          console.warn('Erro ao salvar no Supabase/localStorage:', e);
        });
      } catch (e) {
        console.warn('Erro ao salvar no histórico:', e);
      }

      setIsGenerating(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar arte:', err);
      setIsGenerating(false);
    }
  };

  const filteredTemplates = SOLEMN_TEMPLATES.filter((tmpl) => {
    if (formatFilter === 'todos') return true;
    return tmpl.ratio === formatFilter;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-8 pt-3 sm:pt-6 pb-6 sm:pb-10 animate-fadeIn font-sans">
      {/* Touch Modal for Image Cropping */}
      <ImageTouchModal
        isOpen={Boolean(rawPhotoToCrop)}
        imageSrc={rawPhotoToCrop || ''}
        aspectRatio={selectedTemplate.ratio === '9:16' ? 9 / 16 : 3 / 4}
        onConfirm={(cropped) => {
          setPhotoUrl(cropped);
          setRawPhotoToCrop(null);
        }}
        onClose={() => setRawPhotoToCrop(null)}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/*"
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* VIEW 1: UGC BUILDER VISUAL GALLERY (Select template)                      */}
      {/* ========================================================================= */}
      {viewMode === 'gallery' ? (
        <div className="flex flex-col flex-1">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-hairline">
            <button
              onClick={() => onNavigate('artes-submenu')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-tactile text-xs sm:text-sm font-medium text-secondary hover:text-primary transition-all cursor-pointer font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-wine" />
              <span>Voltar para Formatos</span>
            </button>
            
            {/* Interactive Breadcrumb */}
            <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium bg-surface-elevated px-2 sm:px-3 py-1 rounded-xl border border-hairline">
              <button
                type="button"
                onClick={handleBackToGallery}
                className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg transition-all cursor-pointer btn-tactile-white text-xs sm:text-sm font-sans"
              >
                1. Modelos
              </button>
              <span className="text-muted">/</span>
              <button
                type="button"
                onClick={() => handleGoToCustomize()}
                className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg transition-all cursor-pointer text-secondary hover:text-primary hover:bg-surface text-xs sm:text-sm font-sans"
              >
                2. Personalização
              </button>
            </nav>
          </div>

          {/* Header (Clean, Big title with BlurText + subtle subtitle) */}
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated border border-hairline text-secondary text-[11px] sm:text-xs font-semibold mb-2 shadow-sm font-sans">
              <Layers className="w-3 h-3 text-accent-wine" />
              <span>Modelos Solenes Oficiais</span>
            </div>

            <div className="mb-1.5">
              <BlurText
                text="Selecione o modelo que deseja"
                delay={40}
                animateBy="words"
                direction="top"
                className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-sans inline-block"
              />
            </div>

            <p className="text-xs sm:text-sm md:text-base text-secondary max-w-xl mx-auto leading-relaxed font-sans">
              Modelos de alta resolução para Feed (1080x1440) e Stories (1080x1920 com safe area de 150px)
            </p>

            {/* Filter Pills */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setFormatFilter('todos')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer font-sans ${
                  formatFilter === 'todos'
                    ? 'btn-tactile-white shadow-sm'
                    : 'bg-surface-elevated text-secondary hover:text-primary border border-hairline'
                }`}
              >
                Todos ({SOLEMN_TEMPLATES.length})
              </button>
              <button
                type="button"
                onClick={() => setFormatFilter('3:4')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer font-sans ${
                  formatFilter === '3:4'
                    ? 'btn-tactile-white shadow-sm'
                    : 'bg-surface-elevated text-secondary hover:text-primary border border-hairline'
                }`}
              >
                Feed 3:4 (1080x1440)
              </button>
              <button
                type="button"
                onClick={() => setFormatFilter('9:16')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer font-sans ${
                  formatFilter === '9:16'
                    ? 'btn-tactile-white shadow-sm'
                    : 'bg-surface-elevated text-secondary hover:text-primary border border-hairline'
                }`}
              >
                Stories 9:16 (1080x1920)
              </button>
            </div>
          </div>

          {/* UGC Gallery Grid (Clean 2 rows x 3 columns on desktop, 2 columns on mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-24">
            {filteredTemplates.map((tmpl) => {
              const isSelected = selectedTemplate.id === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  onDoubleClick={() => handleGoToCustomize(tmpl)}
                  className={`group relative rounded-[24px] cursor-pointer transition-all duration-300 select-none overflow-hidden aspect-[3/4] card-tactile ${
                    isSelected
                      ? 'border-[3px] border-accent-wine shadow-lg scale-[1.01]'
                      : 'border-[3px] border-hairline hover:border-accent-wine/40 bg-surface shadow-sm'
                  }`}
                >
                  {/* Clean Visual Mockup of the Artwork */}
                  <div className="relative w-full h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
                    {/* Background solemn gradient */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to bottom, ${tmpl.bgGradient[0]} 0%, ${tmpl.bgGradient[1]} 50%, ${tmpl.bgGradient[2]} 100%)`
                      }}
                    />
                    {/* Theme radial glow */}
                    <div
                      className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-35"
                      style={{ backgroundColor: tmpl.themeColor }}
                    />
                    {/* Fine solemn double border inside the card mockup */}
                    <div
                      className="absolute inset-3 rounded-xl border pointer-events-none transition-all duration-300"
                      style={{ borderColor: tmpl.borderColor }}
                    />
                    <div
                      className="absolute inset-4 rounded-lg border pointer-events-none opacity-40"
                      style={{ borderColor: tmpl.borderColor }}
                    />

                    {/* Top Content (Header Tag) */}
                    <div className="relative z-10 text-center pt-2">
                      <span
                        className="text-[9px] sm:text-[11px] font-bold tracking-widest uppercase block font-sans truncate px-2"
                        style={{ color: tmpl.themeColor }}
                      >
                        {tmpl.accentText}
                      </span>
                    </div>

                    {/* Center Icon/Emblem Showcase */}
                    <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 p-1.5 shadow-xl flex items-center justify-center bg-[#101015]/85 backdrop-blur-sm group-hover:scale-105 transition-transform"
                        style={{ borderColor: tmpl.themeColor }}
                      >
                        <img
                          src="/assets/dove-red-flower.svg"
                          alt="Pomba da Paz"
                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        />
                      </div>
                      <span className="mt-3 text-xs sm:text-sm font-bold text-white tracking-tight drop-shadow font-sans">
                        Nome da Pessoa
                      </span>
                      <span
                        className="text-[10px] sm:text-xs font-semibold tracking-wider font-mono"
                        style={{ color: tmpl.themeColor }}
                      >
                        * 1954  † 2026
                      </span>
                    </div>

                    {/* Bottom Message preview */}
                    <div className="relative z-10 text-center pb-2">
                      <p className="text-[10px] sm:text-xs italic font-serif text-zinc-300 line-clamp-2 px-1">
                        "{tmpl.quote}"
                      </p>
                    </div>

                    {/* Top Right Format Tag Badge */}
                    <div className="absolute top-3.5 right-3.5 z-20">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-surface/90 border border-hairline text-primary backdrop-blur-md font-sans">
                        {tmpl.tag}
                      </span>
                    </div>

                    {/* Bottom Left Discreet Uppercase Label */}
                    <div className="absolute bottom-3.5 left-3.5 z-20">
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-surface/90 backdrop-blur-md border border-hairline text-xs font-bold tracking-wider text-primary uppercase shadow-md font-sans">
                        {tmpl.label}
                      </span>
                    </div>

                    {/* Top Left Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-3.5 left-3.5 z-20 w-7 h-7 rounded-full bg-red-600 border border-white/50 flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Action Bar with High Contrast Next Button */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-hairline px-4 sm:px-8 py-3.5 shadow-lg transition-colors">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedTemplate.themeColor }}
                />
                <div className="text-xs sm:text-sm text-secondary font-sans">
                  <span>Modelo selecionado: </span>
                  <span className="font-bold text-primary">{selectedTemplate.name}</span>
                  <span className="text-muted ml-1.5 hidden sm:inline">({selectedTemplate.tag})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGoToCustomize()}
                  className="btn-tactile-white font-bold px-6 sm:px-8 py-3 rounded-full shadow-md flex items-center gap-2 text-sm sm:base cursor-pointer font-sans"
                >
                  <span>Avançar para Personalizar</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: CUSTOMIZE & PREVIEW STAGE                                         */
        /* ========================================================================= */
        <div className="flex flex-col flex-1 animate-fadeIn">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-3 border-b border-hairline">
            <button
              onClick={handleBackToGallery}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl btn-tactile text-xs sm:text-sm font-medium text-secondary hover:text-primary transition-all cursor-pointer font-sans"
            >
              <ArrowLeft className="w-4 h-4 text-accent-wine" />
              <span>← Voltar aos Modelos</span>
            </button>
            
            {/* Interactive Breadcrumb */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium bg-surface-elevated px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-hairline">
              <button
                type="button"
                onClick={handleBackToGallery}
                className="px-3 py-1 rounded-lg transition-all cursor-pointer text-secondary hover:text-primary hover:bg-surface font-sans"
              >
                1. Modelos
              </button>
              <span className="text-muted">/</span>
              <button
                type="button"
                className="px-3 py-1 rounded-lg transition-all cursor-pointer btn-tactile-white text-xs sm:text-sm font-sans"
              >
                2. Personalização
              </button>
            </nav>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight font-sans">
              Personalizar Homenagem ({selectedTemplate.tag})
            </h1>
            <p className="mt-1 text-sm sm:text-base text-secondary font-sans">
              Preencha os dados e gere a imagem em alta resolução ({selectedTemplate.ratio === '9:16' ? '1080x1920 com safe area de 150px' : '1080x1440'}).
            </p>
          </div>

          {/* 2-Column Responsive Layout: Controls & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Left Column: Form Controls (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Photo Section */}
              <div className="p-6 rounded-2xl bg-surface border border-hairline shadow-sm card-tactile">
                <label className="block text-sm font-bold text-primary mb-3 font-sans">
                  1. Foto da Pessoa Homenageada
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border border-hairline bg-surface-elevated overflow-hidden flex items-center justify-center">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Foto Selecionada"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-secondary" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl btn-tactile text-xs sm:text-sm font-semibold text-primary transition-all flex items-center gap-2 cursor-pointer font-sans"
                      >
                        <ImageIcon className="w-4 h-4 text-accent-wine" />
                        <span>Carregar da Galeria</span>
                      </button>

                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setRawPhotoToCrop(photoUrl)}
                          className="px-4 py-2 rounded-xl btn-tactile text-xs sm:text-sm font-semibold text-secondary hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer font-sans"
                        >
                          <Move className="w-3.5 h-3.5 text-accent-wine" />
                          <span>Ajustar Toque</span>
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-muted font-sans">
                      Formatos aceitos: JPG, PNG, WebP
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="p-6 rounded-2xl bg-surface border border-hairline shadow-sm card-tactile space-y-4">
                <label className="block text-sm font-bold text-primary font-sans">
                  2. Dados da Homenagem
                </label>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1 font-sans">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-hairline text-primary placeholder:text-muted text-base focus:border-accent-wine focus:outline-none transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1 font-sans">
                    Datas (Nascimento e Falecimento)
                  </label>
                  <input
                    type="text"
                    value={datas}
                    onChange={(e) => setDatas(e.target.value)}
                    placeholder="Ex: * 15/04/1954  † 20/11/2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-hairline text-primary placeholder:text-muted text-base focus:border-accent-wine focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-secondary font-sans">
                      Mensagem de Conforto
                    </label>
                    <span className="text-[10px] text-muted font-sans">Sugestões rápidas abaixo</span>
                  </div>
                  <textarea
                    rows={3}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-hairline text-primary placeholder:text-muted text-base focus:border-accent-wine focus:outline-none transition-colors resize-none font-sans"
                  />

                  {/* Quick message pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setMensagem(
                          'Combati o bom combate, acabei a carreira, guardei a fé. Sua memória viverá eternamente em nossos corações.'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-hairline text-[11px] text-secondary hover:text-primary transition-colors font-sans cursor-pointer"
                    >
                      "Combati o bom combate..."
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setMensagem(
                          'Aqueles que amamos nunca morrem, apenas partem antes de nós. O amor é infinito.'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-hairline text-[11px] text-secondary hover:text-primary transition-colors font-sans cursor-pointer"
                    >
                      "Aqueles que amamos..."
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setMensagem(
                          'Sua presença continuará guiando nossos passos. Descanse na paz eterna do Senhor.'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-hairline text-[11px] text-secondary hover:text-primary transition-colors font-sans cursor-pointer"
                    >
                      "Descanse na paz eterna..."
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1 font-sans">
                    Cerimônia / Local (Opcional)
                  </label>
                  <input
                    type="text"
                    value={cerimonia}
                    onChange={(e) => setCerimonia(e.target.value)}
                    placeholder="Ex: Velório Municipal • Sala 02 — Sepultamento às 16h"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated border border-hairline text-primary placeholder:text-muted text-base focus:border-accent-wine focus:outline-none transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadArt}
                  disabled={isGenerating}
                  className="w-full sm:flex-1 py-4 px-6 rounded-2xl btn-tactile-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md cursor-pointer font-sans"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Gerando Homenagem em Alta Resolução...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 stroke-[2.5]" />
                      <span>Baixar Arte Pronta ({selectedTemplate.tag} — PNG)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToGallery}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl btn-tactile text-secondary hover:text-primary font-semibold text-sm transition-all font-sans cursor-pointer"
                >
                  Trocar Modelo
                </button>
              </div>

              {downloadSuccess && (
                <div className="p-4 rounded-xl bg-surface-elevated border border-hairline text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn font-sans">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>
                    Arte baixada com sucesso e arquivada em <b>Meu Histórico</b>.
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Live Realistic Preview (5 cols on lg) */}
            <div className="lg:col-span-5 sticky top-8">
              <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-hairline shadow-sm flex flex-col items-center card-tactile">
                <div className="w-full flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Eye className="w-3.5 h-3.5 text-accent-wine" />
                    <span>Prévia em Tempo Real</span>
                  </span>
                  <span className="text-[11px] font-mono text-muted">
                    {selectedTemplate.tag} ({selectedTemplate.ratio === '9:16' ? '1080x1920' : '1080x1440'})
                  </span>
                </div>

                {/* Simulated Container Preview with true aspect ratio */}
                <div
                  className={`relative w-full rounded-xl overflow-hidden shadow-xl border-2 flex flex-col justify-between p-4 sm:p-6 ${
                    selectedTemplate.ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-[3/4]'
                  }`}
                  style={{
                    borderColor: selectedTemplate.borderColor,
                    background: `linear-gradient(to bottom, ${selectedTemplate.bgGradient[0]} 0%, ${selectedTemplate.bgGradient[1]} 50%, ${selectedTemplate.bgGradient[2]} 100%)`
                  }}
                >
                  {/* Background Radial Glow */}
                  <div
                    className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: selectedTemplate.themeColor }}
                  />

                  {/* Stories Safe Area Guideline Note */}
                  {selectedTemplate.ratio === '9:16' && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[9px] font-mono text-zinc-400 pointer-events-none">
                      Safe Area 150px
                    </div>
                  )}

                  {/* Fine double border mockup */}
                  <div
                    className={`absolute rounded-lg border pointer-events-none opacity-60 ${
                      selectedTemplate.ratio === '9:16' ? 'inset-x-3 top-6 bottom-6' : 'inset-3'
                    }`}
                    style={{ borderColor: selectedTemplate.borderColor }}
                  />

                  {/* Header text */}
                  <div className={`relative z-10 text-center ${selectedTemplate.ratio === '9:16' ? 'pt-4' : 'pt-2'}`}>
                    <span
                      className="text-[10px] sm:text-xs font-bold tracking-widest uppercase block font-sans"
                      style={{ color: selectedTemplate.themeColor }}
                    >
                      {selectedTemplate.accentText}
                    </span>
                    <div className="mt-1 h-[1px] w-12 mx-auto bg-white/20" />
                  </div>

                  {/* Photo circle or Dove */}
                  <div className="relative z-10 flex flex-col items-center my-auto py-2">
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 p-1 shadow-2xl flex items-center justify-center bg-[#101015]/90 overflow-hidden"
                      style={{ borderColor: selectedTemplate.themeColor }}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Homenageado"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <img
                          src="/assets/dove-red-flower.svg"
                          alt="Paz"
                          className="w-12 h-12 object-contain"
                        />
                      )}
                    </div>

                    <h2 className="mt-3 text-base sm:text-lg font-bold text-white text-center tracking-tight truncate max-w-full px-2 font-sans">
                      {nome || 'Nome da Pessoa'}
                    </h2>
                    <span
                      className="text-[11px] font-semibold tracking-wider font-mono text-center"
                      style={{ color: selectedTemplate.themeColor }}
                    >
                      {datas || '* Datas'}
                    </span>
                  </div>

                  {/* Message & Ceremony */}
                  <div className={`relative z-10 text-center px-2 ${selectedTemplate.ratio === '9:16' ? 'pb-4' : 'pb-2'}`}>
                    <p className="text-xs sm:text-sm italic font-serif text-zinc-300 line-clamp-3 leading-relaxed">
                      "{mensagem || selectedTemplate.quote}"
                    </p>
                    {cerimonia && (
                      <p className="mt-2 text-[10px] text-zinc-400 font-sans truncate">
                        {cerimonia}
                      </p>
                    )}
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
