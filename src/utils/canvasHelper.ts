// Helper to generate real downloadable PNG images using HTML5 Canvas
// and audio synthesizing for realistic preview & download.

let globalDoveImg: HTMLImageElement | null = null;
if (typeof window !== 'undefined') {
  globalDoveImg = new Image();
  globalDoveImg.src = '/assets/dove-red-flower.svg';
}

export interface MemorialData {
  nome: string;
  nascimento: string;
  falecimento: string;
  velorio?: string;
  sepultamento?: string;
  mensagem?: string;
  cidade?: string;
}

export interface TemplateItem {
  id: string;
  label: string;
  name: string;
  ratio: '3:4' | '9:16';
  tag: string;
  description: string;
  themeColor: string;
  borderColor: string;
  accentText: string;
  quote: string;
  bgGradient: [string, string, string]; // [top, mid, bottom] for Canvas
  bgGradientCss: string; // for Tailwind CSS preview
  glowColor: string;
}

export const SOLEMN_TEMPLATES: TemplateItem[] = [
  {
    id: 'gold-classic-feed',
    label: 'CLÁSSICO DOURADO',
    name: 'Solene Clássico Dourado',
    ratio: '3:4',
    tag: 'Feed 3:4',
    description: 'Bordas duplas douradas nobres, fundo preto aveludado profundo e tipografia comemorativa de honra.',
    themeColor: '#D4AF37',
    borderColor: 'rgba(212, 175, 55, 0.55)',
    accentText: '★ EM MEMÓRIA E ETERNA SAUDADE ✝',
    quote: 'Sua lembrança permanecerá viva em cada coração que tocou.',
    bgGradient: ['#1A1608', '#0F0E07', '#08080A'],
    bgGradientCss: 'from-[#1A1608] via-[#0F0E07] to-[#08080A]',
    glowColor: 'rgba(212, 175, 55, 0.18)'
  },
  {
    id: 'candle-light-story',
    label: 'LUZ DE VELA',
    name: 'Luz de Vela Noturna',
    ratio: '9:16',
    tag: 'Stories 9:16',
    description: 'Atmosfera de vigília suave, iluminação central solene e reverência eterna com safe area de 150px.',
    themeColor: '#FFFFFF',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    accentText: '✦ QUE BRILHE A LUZ ETERNA ✦',
    quote: 'Aqueles que amamos nunca morrem, apenas partem antes de nós.',
    bgGradient: ['#181826', '#101018', '#08080A'],
    bgGradientCss: 'from-[#181826] via-[#101018] to-[#08080A]',
    glowColor: 'rgba(245, 158, 11, 0.20)'
  },
  {
    id: 'marble-longing-feed',
    label: 'MÁRMORE & SAUDADE',
    name: 'Mármore & Saudade',
    ratio: '3:4',
    tag: 'Feed 3:4',
    description: 'Textura sutil de pedra nobre, moldura minimalista fina e serenidade sóbria.',
    themeColor: '#E4E4E7',
    borderColor: 'rgba(228, 228, 231, 0.5)',
    accentText: 'COM CARINHO E GRATIDÃO ETERNA',
    quote: 'O amor não acaba com a despedida, ele se torna eterno na memória.',
    bgGradient: ['#181820', '#111116', '#08080A'],
    bgGradientCss: 'from-[#181820] via-[#111116] to-[#08080A]',
    glowColor: 'rgba(228, 228, 231, 0.14)'
  },
  {
    id: 'vigil-love-story',
    label: 'VIGÍLIA DO AMOR',
    name: 'Vigília do Amor Eterno',
    ratio: '9:16',
    tag: 'Stories 9:16',
    description: 'Layout vertical expansivo com safe area de 150px, foco na foto e oração solene.',
    themeColor: '#F59E0B',
    borderColor: 'rgba(245, 158, 11, 0.55)',
    accentText: '✦ VIGÍLIA DO AMOR ETERNO ✦',
    quote: 'A saudade é o amor que fica. Sua história é o nosso maior legado.',
    bgGradient: ['#22160A', '#140D06', '#08080A'],
    bgGradientCss: 'from-[#22160A] via-[#140D06] to-[#08080A]',
    glowColor: 'rgba(245, 158, 11, 0.18)'
  },
  {
    id: 'rose-whisper-story',
    label: 'ROSA SOLENE',
    name: 'Rosa Solene & Pétalas',
    ratio: '9:16',
    tag: 'Stories 9:16',
    description: 'Toque de amor eterno com safe area de 150px, acento em carmesim de respeito e afeto profundo.',
    themeColor: '#EF4444',
    borderColor: 'rgba(239, 68, 68, 0.55)',
    accentText: 'ETERNAMENTE EM NOSSOS CORAÇÕES',
    quote: 'Para sempre guardado nas nossas melhores lembranças e orações.',
    bgGradient: ['#240D10', '#14080A', '#08080A'],
    bgGradientCss: 'from-[#240D10] via-[#14080A] to-[#08080A]',
    glowColor: 'rgba(220, 38, 38, 0.20)'
  },
  {
    id: 'serene-peace-feed',
    label: 'PAZ CELESTIAL',
    name: 'Paz Celestial Branca',
    ratio: '3:4',
    tag: 'Feed 3:4',
    description: 'Alvura etérea, raios de luz suave, serenidade eterna e consolo espiritual.',
    themeColor: '#93C5FD',
    borderColor: 'rgba(147, 197, 253, 0.5)',
    accentText: 'DESCANSO EM PAZ E LUZ DIVINA',
    quote: 'Descansou nos braços da paz e vive para sempre no amor divino.',
    bgGradient: ['#0D1B2A', '#09111C', '#08080A'],
    bgGradientCss: 'from-[#0D1B2A] via-[#09111C] to-[#08080A]',
    glowColor: 'rgba(96, 165, 250, 0.16)'
  }
];

export interface SolemnArtOptions {
  ratio: '3:4' | '9:16';
  templateId?: string;
  data: MemorialData;
  photoImg?: HTMLImageElement | null;
  grayscalePhoto?: boolean;
  cerimoniaRaw?: string;
  rawDatas?: string;
}

export function findTemplate(idOrRatio?: string, ratio?: '3:4' | '9:16'): TemplateItem {
  if (idOrRatio) {
    const found = SOLEMN_TEMPLATES.find((t) => t.id === idOrRatio);
    if (found) return found;
  }
  const targetRatio = ratio || (idOrRatio === '9:16' ? '9:16' : '3:4');
  return SOLEMN_TEMPLATES.find((t) => t.ratio === targetRatio) || SOLEMN_TEMPLATES[0];
}

// Draw corner ornaments in noble bracket L-shape
function drawCornerOrnaments(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  len: number = 24
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(x, y + len);
  ctx.lineTo(x, y);
  ctx.lineTo(x + len, y);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + len);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(x + w, y + h - len);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w - len, y + h);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(x + len, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + h - len);
  ctx.stroke();

  ctx.restore();
}

// Master Canvas Rendering Engine
export function renderSolemnArtCanvas(
  canvas: HTMLCanvasElement,
  options: SolemnArtOptions
): void {
  const isStory = options.ratio === '9:16';
  const width = 1080;
  const height = isStory ? 1920 : 1440; // Exact resolutions: 1080x1440 (Feed 3:4) and 1080x1920 (Stories 9:16)

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const tmpl = findTemplate(options.templateId, options.ratio);
  const data = options.data;

  // 1. Full-bleed background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, tmpl.bgGradient[0]);
  bgGrad.addColorStop(0.5, tmpl.bgGradient[1]);
  bgGrad.addColorStop(1, tmpl.bgGradient[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle radial glow behind photo / center
  const glowY = isStory ? 510 : 560;
  const radialGlow = ctx.createRadialGradient(width / 2, glowY, 40, width / 2, glowY, 520);
  radialGlow.addColorStop(0, tmpl.glowColor);
  radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Borders & Ornaments (STRICT SAFE AREA ON STORIES: 150px top and 150px bottom)
  if (isStory) {
    // Stories 9:16: Safe Area is 150px top and 150px bottom.
    // Usable vertical range: [150, 1770].
    // External border runs from y=160 to y=1750 (height=1590), giving 10px breathing room inside safe bounds.
    const bx = 48;
    const by = 160;
    const bw = width - 96; // 984
    const bh = 1590; // ends at 1750

    ctx.strokeStyle = tmpl.themeColor;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx + 12, by + 12, bw - 24, bh - 24);

    drawCornerOrnaments(ctx, bx + 22, by + 22, bw - 44, bh - 44, tmpl.themeColor, 28);
  } else {
    // Feed 3:4: 1080 x 1440
    const bx = 44;
    const by = 44;
    const bw = width - 88; // 992
    const bh = height - 88; // 1352

    ctx.strokeStyle = tmpl.themeColor;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx + 14, by + 14, bw - 28, bh - 28);

    drawCornerOrnaments(ctx, bx + 26, by + 26, bw - 52, bh - 52, tmpl.themeColor, 24);
  }

  // 4. Header Top Text
  ctx.textAlign = 'center';
  ctx.fillStyle = tmpl.themeColor;
  ctx.font = '700 24px "Plus Jakarta Sans", "Inter", sans-serif';
  const headerY = isStory ? 230 : 145;
  ctx.fillText(tmpl.accentText, width / 2, headerY);

  // Subtle divider line under header
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, headerY + 22);
  ctx.lineTo(width / 2 + 140, headerY + 22);
  ctx.stroke();

  // 5. Layout Configuration (Feed vs Story)
  if (isStory) {
    // Stories Layout: Center Photo at y=490, radius=165
    const photoRadius = 165;
    const photoCenterY = 490;

    drawPhotoWithFrame(
      ctx,
      options.photoImg,
      width / 2,
      photoCenterY,
      photoRadius,
      options.grayscalePhoto,
      tmpl.themeColor
    );

    // Name of Honored Person
    const nameY = 745;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 56px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((data.nome || 'Nome do Homenageado').toUpperCase(), width / 2, nameY);

    // Dates (* Nascimento  † Falecimento)
    const datesY = 810;
    ctx.fillStyle = tmpl.themeColor;
    ctx.font = '600 28px "Plus Jakarta Sans", "Inter", sans-serif';
    const datesStr = formatDatesString(data, options.rawDatas);
    ctx.fillText(datesStr, width / 2, datesY);

    // Subtle separator line
    ctx.strokeStyle = tmpl.themeColor + '40';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 160, 845);
    ctx.lineTo(width / 2 + 160, 845);
    ctx.stroke();

    // Comfort Quote / Message
    const quoteY = 910;
    ctx.fillStyle = '#E4E4E7';
    ctx.font = 'italic 400 32px "Cormorant Garamond", "DejaVu Serif", serif';
    const messageText = data.mensagem || tmpl.quote || '“Aqueles que amamos nunca morrem, apenas partem antes de nós.”';
    const fullQuote = messageText.startsWith('“') || messageText.startsWith('"') ? messageText : `“${messageText}”`;
    wrapText(ctx, fullQuote, width / 2, quoteY, 840, 46, 4);

    // Stories Ceremony Box: y=1140 to y=1630 (h=490px), safely inside [150, 1770]
    const boxX = 88;
    const boxY = 1140;
    const boxW = width - 176; // 904
    const boxH = 490;

    ctx.fillStyle = 'rgba(18, 18, 24, 0.88)';
    roundRect(ctx, boxX, boxY, boxW, boxH, 24);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Box Title
    ctx.fillStyle = '#DC2626';
    ctx.font = '700 24px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText('CERIMÔNIA DE DESPEDIDA', width / 2, boxY + 55);

    ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, boxY + 75);
    ctx.lineTo(width / 2 + 120, boxY + 75);
    ctx.stroke();

    // Wake / Velório
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 28px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText('Velório:', width / 2, boxY + 140);

    ctx.fillStyle = '#D1D5DB';
    ctx.font = '500 25px "Plus Jakarta Sans", "Inter", sans-serif';
    const velorioText = data.velorio || options.cerimoniaRaw || 'Capela Memorial • Sala 01';
    wrapText(ctx, velorioText, width / 2, boxY + 185, boxW - 80, 34, 2);

    // Burial / Sepultamento
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 28px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText('Sepultamento:', width / 2, boxY + 290);

    ctx.fillStyle = '#D1D5DB';
    ctx.font = '500 25px "Plus Jakarta Sans", "Inter", sans-serif';
    const sepultamentoText = data.sepultamento || options.cerimoniaRaw || 'Cemitério Municipal Parque das Flores';
    wrapText(ctx, sepultamentoText, width / 2, boxY + 335, boxW - 80, 34, 2);

    // Stories Footer (Safe area: 1720 < 1770)
    ctx.fillStyle = '#71717A';
    ctx.font = '500 22px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText('Memorial Homenagens • Descanse em Paz', width / 2, 1720);

  } else {
    // Feed 3:4 Layout (1080 x 1440)
    // Name on top for editorial elegance
    const nameY = 250;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 52px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((data.nome || 'Nome do Homenageado').toUpperCase(), width / 2, nameY);

    // Dates (* Nascimento  † Falecimento)
    const datesY = 308;
    ctx.fillStyle = tmpl.themeColor;
    ctx.font = '600 26px "Plus Jakarta Sans", "Inter", sans-serif';
    const datesStr = formatDatesString(data, options.rawDatas);
    ctx.fillText(datesStr, width / 2, datesY);

    // Fine separator
    ctx.strokeStyle = tmpl.themeColor + '40';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 150, 338);
    ctx.lineTo(width / 2 + 150, 338);
    ctx.stroke();

    // Center Photo at y=550, radius=150
    const photoRadius = 150;
    const photoCenterY = 550;

    drawPhotoWithFrame(
      ctx,
      options.photoImg,
      width / 2,
      photoCenterY,
      photoRadius,
      options.grayscalePhoto,
      tmpl.themeColor
    );

    // Quote
    const quoteY = 760;
    ctx.fillStyle = '#E4E4E7';
    ctx.font = 'italic 400 30px "Cormorant Garamond", "DejaVu Serif", serif';
    const messageText = data.mensagem || tmpl.quote || '“Aqueles que amamos nunca morrem, apenas partem antes de nós.”';
    const fullQuote = messageText.startsWith('“') || messageText.startsWith('"') ? messageText : `“${messageText}”`;
    wrapText(ctx, fullQuote, width / 2, quoteY, 840, 42, 3);

    // Ceremony Box (y=980 to 1285, h=305px)
    const boxX = 88;
    const boxY = 980;
    const boxW = width - 176; // 904
    const boxH = 305;

    ctx.fillStyle = 'rgba(18, 18, 24, 0.85)';
    roundRect(ctx, boxX, boxY, boxW, boxH, 20);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Box Title
    ctx.fillStyle = '#DC2626';
    ctx.font = '700 22px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText('INFORMAÇÕES DE DESPEDIDA', width / 2, boxY + 45);

    ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 110, boxY + 62);
    ctx.lineTo(width / 2 + 110, boxY + 62);
    ctx.stroke();

    // Velório and Sepultamento in Feed
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 26px "Plus Jakarta Sans", "Inter", sans-serif';
    const velorioFeed = data.velorio || options.cerimoniaRaw || 'Capela Memorial • Sala 01';
    ctx.fillText(`Velório: ${velorioFeed}`, width / 2, boxY + 125);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 26px "Plus Jakarta Sans", "Inter", sans-serif';
    const sepultamentoFeed = data.sepultamento || options.cerimoniaRaw || 'Cemitério Municipal Parque das Flores';
    ctx.fillText(`Sepultamento: ${sepultamentoFeed}`, width / 2, boxY + 205);

    // Feed Footer (y=1380 < 1440)
    ctx.fillStyle = '#71717A';
    ctx.font = '500 21px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText('Memorial Homenagens • Que o amor e as lembranças sejam eterno consolo', width / 2, 1380);
  }
}

function formatDatesString(data: MemorialData, rawDatas?: string): string {
  if (rawDatas && rawDatas.trim().length > 0) {
    return rawDatas;
  }
  const nasc = data.nascimento || '00/00/0000';
  const falec = data.falecimento || '00/00/0000';
  return `★ ${nasc}   ✦   ✝ ${falec}`;
}

function drawPhotoWithFrame(
  ctx: CanvasRenderingContext2D,
  photoImg: HTMLImageElement | null | undefined,
  cx: number,
  cy: number,
  radius: number,
  grayscale?: boolean,
  borderColor: string = '#D4AF37'
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (photoImg && photoImg.complete && photoImg.naturalWidth > 0) {
    if (grayscale) {
      ctx.filter = 'grayscale(100%) contrast(108%) brightness(96%)';
    }
    const pWidth = photoImg.naturalWidth || photoImg.width;
    const pHeight = photoImg.naturalHeight || photoImg.height;
    const scale = Math.max((radius * 2) / pWidth, (radius * 2) / pHeight);
    const drawW = pWidth * scale;
    const drawH = pHeight * scale;
    const drawX = cx - drawW / 2;
    const drawY = cy - drawH / 2;
    ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);
  } else {
    // Solemn dark placeholder
    ctx.fillStyle = '#111116';
    ctx.fill();
    if (globalDoveImg && globalDoveImg.complete && globalDoveImg.naturalWidth > 0) {
      const doveSize = radius * 0.95;
      ctx.drawImage(
        globalDoveImg,
        cx - doveSize / 2,
        cy - doveSize / 2,
        doveSize,
        doveSize
      );
    } else {
      drawDoveEmblemFallback(ctx, cx, cy, radius * 0.85, borderColor);
    }
  }
  ctx.restore();

  // Outer gold / theme ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;
  ctx.stroke();

  // Inner subtle ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 7, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Respectful black mourning ribbon on the bottom-right corner of the frame
  const ribbonX = cx + radius * 0.72;
  const ribbonY = cy + radius * 0.72;
  drawRibbon(ctx, ribbonX, ribbonY, '#111827');
}

// Draw a fallback vector dove if SVG is still loading
function drawDoveEmblemFallback(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  const s = size / 100;
  ctx.scale(s, s);

  // Peaceful Dove shape
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -10, 16, 0, Math.PI * 2); // head
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-35, 10, -30, 35);
  ctx.quadraticCurveTo(0, 30, 25, 15);
  ctx.quadraticCurveTo(15, 0, 0, 0);
  ctx.fill();

  // Wings
  ctx.beginPath();
  ctx.moveTo(-10, -5);
  ctx.quadraticCurveTo(-45, -35, -20, -45);
  ctx.quadraticCurveTo(5, -30, 0, 5);
  ctx.fill();

  // Red flower in beak
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.arc(18, -12, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Synchronous Render to Data URL
export function renderSolemnArt(options: SolemnArtOptions): string {
  const isStory = options.ratio === '9:16';
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = isStory ? 1920 : 1440;
  renderSolemnArtCanvas(canvas, options);
  return canvas.toDataURL('image/png');
}

// Asynchronous Render (ensures external image or dataURL is loaded)
export async function renderSolemnArtAsync(
  options: SolemnArtOptions & { photoUrl?: string | null }
): Promise<string> {
  let photoImg: HTMLImageElement | null = options.photoImg || null;

  if (!photoImg && options.photoUrl) {
    try {
      photoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load photo image'));
        img.src = options.photoUrl!;
      });
    } catch {
      photoImg = null;
    }
  }

  return renderSolemnArt({
    ...options,
    photoImg
  });
}

// Feed 3:4 Helper (1080 x 1440) - Backward compatible with ChatScreen
export function drawFeedImage(
  data: MemorialData,
  photoImg?: HTMLImageElement | null,
  templateId?: string
): string {
  return renderSolemnArt({
    ratio: '3:4',
    templateId: templateId || 'gold-classic-feed',
    data,
    photoImg
  });
}

// Story 9:16 Helper (1080 x 1920) - Backward compatible with ChatScreen
export function drawStoryImage(
  data: MemorialData,
  photoImg?: HTMLImageElement | null,
  templateId?: string
): string {
  return renderSolemnArt({
    ratio: '9:16',
    templateId: templateId || 'candle-light-story',
    data,
    photoImg
  });
}

// Profile Avatar Generator (Square 600x600)
export function drawProfileAvatar(
  imgElement: HTMLImageElement | null,
  isBlackAndWhite: boolean,
  frameType: 'laco-preto' | 'moldura-dourada' | 'rosa-memorial' | 'minimalista'
): string {
  const size = 600;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const center = size / 2;
  const radius = size / 2 - 30;

  // Clip circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.clip();

  if (imgElement && imgElement.complete) {
    if (isBlackAndWhite) {
      ctx.filter = 'grayscale(100%) contrast(110%) brightness(95%)';
    }
    const scale = Math.max((radius * 2) / imgElement.width, (radius * 2) / imgElement.height);
    const w = imgElement.width * scale;
    const h = imgElement.height * scale;
    const x = center - w / 2;
    const y = center - h / 2;
    ctx.drawImage(imgElement, x, y, w, h);
  } else {
    // Default placeholder silhouette
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#1E293B');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#64748B';
    ctx.font = '160px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👤', center, center + 50);
  }
  ctx.restore();

  // Frames & Ornaments
  if (frameType === 'laco-preto') {
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, radius - 6, 0, Math.PI * 2);
    ctx.stroke();

    drawRibbon(ctx, center + radius * 0.55, center + radius * 0.55, '#111827');
  } else if (frameType === 'moldura-dourada') {
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#F3E5AB';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(center, center, radius - 10, 0, Math.PI * 2);
    ctx.stroke();
  } else if (frameType === 'rosa-memorial') {
    ctx.strokeStyle = '#991B1B';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(center, center, radius - 8, 0, Math.PI * 2);
    ctx.stroke();

    if (globalDoveImg && globalDoveImg.complete && globalDoveImg.naturalWidth > 0) {
      const doveW = 72;
      ctx.drawImage(globalDoveImg, center - doveW / 2, center + radius - 20, doveW, doveW);
    } else {
      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAZ', center, center + radius + 15);
    }
  } else {
    // Minimalista
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}

// Mourning Black Ribbon with Gold Fine Outlines
function drawRibbon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;

  // Left loop
  ctx.beginPath();
  ctx.ellipse(-15, -15, 25, 12, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right loop
  ctx.beginPath();
  ctx.ellipse(15, -15, 25, 12, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tails
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-25, 45);
  ctx.lineTo(-15, 40);
  ctx.lineTo(-5, 0);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(25, 45);
  ctx.lineTo(15, 40);
  ctx.lineTo(5, 0);
  ctx.fill();
  ctx.stroke();

  // Center knot
  ctx.beginPath();
  ctx.arc(0, -5, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 4
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      linesCount++;
      if (linesCount >= maxLines) {
        ctx.fillText(line.trim() + '...', x, currentY);
        return;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Generate realistic solemn memorial chime/audio tone (Web Audio API -> WAV)
export function createSolemnAudioBlob(): Blob {
  const sampleRate = 44100;
  const duration = 4.0;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new Float32Array(numSamples);

  const freqs = [130.81, 196.0, 311.13, 392.0];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    for (let f = 0; f < freqs.length; f++) {
      const envelope = Math.exp(-t * (0.8 + f * 0.3));
      sample += Math.sin(2 * Math.PI * freqs[f] * t) * envelope;
    }
    buffer[i] = sample * 0.25;
  }

  const wavBytes = encodeWAV(buffer, sampleRate);
  return new Blob([wavBytes.buffer as ArrayBuffer], { type: 'audio/wav' });
}

function encodeWAV(samples: Float32Array, sampleRate: number): Uint8Array {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Uint8Array(buffer);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
