// Helper to generate real downloadable PNG images using HTML5 Canvas
// and audio synthesizing for realistic preview & download.

export interface MemorialData {
  nome: string;
  nascimento: string;
  falecimento: string;
  velorio?: string;
  sepultamento?: string;
  mensagem?: string;
}

export function drawFeedImage(data: MemorialData, photoImg?: HTMLImageElement | null): string {
  // Feed 3:4 ratio: 1080 x 1440
  const width = 1080;
  const height = 1440;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0C0C0F');
  bgGrad.addColorStop(0.5, '#16161B');
  bgGrad.addColorStop(1, '#0A0A0D');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle red radial glow at the center-bottom
  const glow = ctx.createRadialGradient(width / 2, height * 0.75, 50, width / 2, height * 0.75, 600);
  glow.addColorStop(0, 'rgba(220, 38, 38, 0.22)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Outer border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // Top header - 100% Sans-Serif
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = '700 32px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText('EM MEMÓRIA E ETERNA SAUDADE', width / 2, 180);

  // Line divider with small jewel
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 180, 220);
  ctx.lineTo(width / 2 + 180, 220);
  ctx.stroke();

  // Name - Sans-serif elegante e moderna
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 64px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText(data.nome || 'Nome do Homenageado', width / 2, 340);

  // Dates (* Nascimento  † Falecimento)
  ctx.fillStyle = '#D4AF37';
  ctx.font = '600 32px "Plus Jakarta Sans", "Inter", sans-serif';
  const nascFalec = `★ ${data.nascimento || '00/00/0000'}   ✦   ✝ ${data.falecimento || '00/00/0000'}`;
  ctx.fillText(nascFalec, width / 2, 420);

  // Memorial Frame in center (photo or placeholder)
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, 630, 160, 0, Math.PI * 2);
  ctx.clip();
  if (photoImg && photoImg.complete) {
    const scale = Math.max(320 / photoImg.width, 320 / photoImg.height);
    const w = photoImg.width * scale;
    const h = photoImg.height * scale;
    const x = (width / 2) - w / 2;
    const y = 630 - h / 2;
    ctx.drawImage(photoImg, x, y, w, h);
  } else {
    ctx.fillStyle = '#111116';
    ctx.fill();
    ctx.fillStyle = '#1A1A22';
    ctx.font = '72px sans-serif';
    ctx.fillText('🕊️', width / 2, 655);
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(width / 2, 630, 160, 0, Math.PI * 2);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Quote or message - Sans-serif moderno e solene
  ctx.fillStyle = '#E5E7EB';
  ctx.font = '500 32px "Plus Jakarta Sans", "Inter", sans-serif';
  const quote = data.mensagem || '“Aqueles que amamos nunca morrem, apenas partem antes de nós.”';
  wrapText(ctx, quote, width / 2, 880, width - 240, 46);

  // Funeral / Wake details container
  const boxY = 1040;
  ctx.fillStyle = 'rgba(22, 22, 27, 0.85)';
  roundRect(ctx, 120, boxY, width - 240, 260, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#DC2626';
  ctx.font = '700 26px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText('INFORMAÇÕES DE DESPEDIDA', width / 2, boxY + 50);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 28px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText(`Velório: ${data.velorio || 'Capela Municipal'}`, width / 2, boxY + 115);
  ctx.fillText(`Sepultamento: ${data.sepultamento || 'Cemitério da Saudade'}`, width / 2, boxY + 175);

  // Footer note
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 22px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText('Memorial Homenagens • Que o amor e as lembranças sejam eterno consolo', width / 2, 1370);

  return canvas.toDataURL('image/png');
}

export function drawStoryImage(data: MemorialData, photoImg?: HTMLImageElement | null): string {
  // Story 9:16 ratio: 1080 x 1920
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0A0A0D');
  bgGrad.addColorStop(0.4, '#16161B');
  bgGrad.addColorStop(1, '#0C0C0F');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Radial Red Glow
  const glow = ctx.createRadialGradient(width / 2, 800, 100, width / 2, 800, 700);
  glow.addColorStop(0, 'rgba(220, 38, 38, 0.25)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Safe area border (Story top and bottom padding)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(50, 120, width - 100, height - 240);

  // Title - Sans-serif
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = '700 36px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText('NOTA DE FALECIMENTO & HOMENAGEM', width / 2, 240);

  // Dove / Photo Frame
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, 450, 150, 0, Math.PI * 2);
  ctx.clip();
  if (photoImg && photoImg.complete) {
    const scale = Math.max(300 / photoImg.width, 300 / photoImg.height);
    const w = photoImg.width * scale;
    const h = photoImg.height * scale;
    const x = (width / 2) - w / 2;
    const y = 450 - h / 2;
    ctx.drawImage(photoImg, x, y, w, h);
  } else {
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '64px sans-serif';
    ctx.fillText('🕊️', width / 2, 475);
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(width / 2, 450, 150, 0, Math.PI * 2);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Name - Sans-serif
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 68px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText(data.nome || 'Nome do Homenageado', width / 2, 690);

  // Dates
  ctx.fillStyle = '#D4AF37';
  ctx.font = '600 34px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText(`★ ${data.nascimento || '00/00/0000'}   ✦   ✝ ${data.falecimento || '00/00/0000'}`, width / 2, 765);

  // Message
  ctx.fillStyle = '#F3F4F6';
  ctx.font = '500 34px "Plus Jakarta Sans", "Inter", sans-serif';
  wrapText(ctx, data.mensagem || '“Combati o bom combate, acabei a carreira, guardei a fé.”', width / 2, 880, width - 260, 52);

  // Details box
  const boxY = 1120;
  ctx.fillStyle = 'rgba(22, 22, 27, 0.9)';
  roundRect(ctx, 100, boxY, width - 200, 420, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#DC2626';
  ctx.font = '700 30px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText('CERIMÔNIA DE DESPEDIDA', width / 2, boxY + 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 30px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText('Velório:', width / 2, boxY + 150);
  ctx.fillStyle = '#D1D5DB';
  ctx.font = '500 26px "Plus Jakarta Sans", "Inter", sans-serif';
  wrapText(ctx, data.velorio || 'Capela Memorial - Sala 01', width / 2, boxY + 195, width - 260, 36);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 30px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText('Sepultamento:', width / 2, boxY + 285);
  ctx.fillStyle = '#D1D5DB';
  ctx.font = '500 26px "Plus Jakarta Sans", "Inter", sans-serif';
  wrapText(ctx, data.sepultamento || 'Cemitério Municipal Parque das Flores', width / 2, boxY + 330, width - 260, 36);

  // Footer
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 24px "Plus Jakarta Sans", "Inter", sans-serif';
  ctx.fillText('Memorial Homenagens • Descanse em Paz', width / 2, 1740);

  return canvas.toDataURL('image/png');
}

export function drawProfileAvatar(
  imgElement: HTMLImageElement | null,
  isBlackAndWhite: boolean,
  frameType: 'laco-preto' | 'moldura-dourada' | 'rosa-memorial' | 'minimalista'
): string {
  const size = 600;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = heightOrSize(size);
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
    // Draw centered aspect-fill
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

  // Now draw frame ornaments on top
  if (frameType === 'laco-preto') {
    // Elegant Black Ribbon & Border
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner subtle gold line
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, radius - 6, 0, Math.PI * 2);
    ctx.stroke();

    // Black ribbon banner at bottom right
    drawRibbon(ctx, center + radius * 0.55, center + radius * 0.55, '#111827');
  } else if (frameType === 'moldura-dourada') {
    // Gold ornamental double ring
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
    // Red/Crimson Ring with Rose symbol
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

    // Memorial flower at bottom center
    ctx.font = '54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌹', center, center + radius + 15);
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

function heightOrSize(s: number) {
  return s;
}

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
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
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
