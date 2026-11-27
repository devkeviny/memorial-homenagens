#!/usr/bin/env node
/**
 * scripts/generate_test_artes.js
 * 
 * Automated Render Test for Memorial Homenagens (Etapa 4)
 * Generates two high-resolution PNG tribute artifacts in /opt/data/artes-teste/:
 * 1. Feed 3:4: 1080 x 1440 px (Solene Clássico Dourado)
 * 2. Stories 9:16: 1080 x 1920 px (Luz de Vela Noturna with 150px safe area)
 */

import fs from 'fs';
import path from 'path';
import { execFileSync, execSync } from 'child_process';

const TARGET_DIR = '/opt/data/artes-teste';
const CHROMIUM_BIN = '/opt/data/.local/bin/chromium';
const SCRATCH_DIR = '/home/hermes/.hermes/profiles/coder/cache/scratch';

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

console.log('='.repeat(70));
console.log('MEMORIAL HOMENAGENS — TESTE AUTOMATIZADO DE RENDERIZAÇÃO (ETAPA 4)');
console.log('='.repeat(70));

const testData = {
  nome: 'Dona Maria Francisca',
  nascimento: '12/03/1945',
  falecimento: '25/11/2026',
  velorio: 'Capela Campo Santo • Sala 03 (Salvador/BA)',
  sepultamento: 'Cemitério Campo Santo às 16:30 (America/Sao_Paulo)',
  mensagem: 'Sua memória e luz permanecerão vivas em cada coração que tocou com infinito carinho.'
};

function buildRenderHtml(ratio, templateId) {
  const isStory = ratio === '9:16';
  const width = 1080;
  const height = isStory ? 1920 : 1440;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Memorial Render Engine - ${ratio}</title>
  <style>
    * { box-sizing: border-box; }
    body, html {
      margin: 0;
      padding: 0;
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      background: #000000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    #renderCanvas {
      display: block;
      width: ${width}px;
      height: ${height}px;
    }
  </style>
</head>
<body>
  <canvas id="renderCanvas" width="${width}" height="${height}"></canvas>
  <script>
    const isStory = ${isStory};
    const width = ${width};
    const height = ${height};
    const canvas = document.getElementById('renderCanvas');
    const ctx = canvas.getContext('2d');

    const templateId = "${templateId}";
    const isGold = templateId === 'gold-classic-feed';

    // 1. Background solemn gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (isGold) {
      bgGrad.addColorStop(0, '#1A1608');
      bgGrad.addColorStop(0.5, '#0F0E07');
      bgGrad.addColorStop(1, '#08080A');
    } else {
      bgGrad.addColorStop(0, '#181826');
      bgGrad.addColorStop(0.5, '#101018');
      bgGrad.addColorStop(1, '#08080A');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Center ambient radial glow
    const glowY = isStory ? 510 : 560;
    const radialGlow = ctx.createRadialGradient(width / 2, glowY, 40, width / 2, glowY, 520);
    radialGlow.addColorStop(0, isGold ? 'rgba(212, 175, 55, 0.20)' : 'rgba(245, 158, 11, 0.22)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    const themeColor = isGold ? '#D4AF37' : '#F59E0B';

    // 3. Borders & Ornaments (STRICT SAFE AREA ON STORIES: 150px top and 150px bottom)
    if (isStory) {
      // Stories 9:16: safe area 150px top/bottom => vertical range [150, 1770]
      const bx = 48;
      const by = 160;
      const bw = width - 96;
      const bh = 1590; // ends at 1750, leaving 20px buffer before 1770

      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx + 12, by + 12, bw - 24, bh - 24);

      drawCornerOrnaments(bx + 22, by + 22, bw - 44, bh - 44, themeColor, 28);
    } else {
      // Feed 3:4: 1080 x 1440
      const bx = 44;
      const by = 44;
      const bw = width - 88;
      const bh = height - 88;

      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(bx, by, bw, bh);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx + 14, by + 14, bw - 28, bh - 28);

      drawCornerOrnaments(bx + 26, by + 26, bw - 52, bh - 52, themeColor, 24);
    }

    // 4. Header Top Text
    ctx.textAlign = 'center';
    ctx.fillStyle = themeColor;
    ctx.font = '700 24px sans-serif';
    const headerY = isStory ? 230 : 145;
    const headerText = isGold ? '★ EM MEMÓRIA E ETERNA SAUDADE ✝' : '✦ QUE BRILHE A LUZ ETERNA ✦';
    ctx.fillText(headerText, width / 2, headerY);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, headerY + 22);
    ctx.lineTo(width / 2 + 140, headerY + 22);
    ctx.stroke();

    // 5. Layout Configuration
    if (isStory) {
      // Stories Layout (1080 x 1920)
      const photoRadius = 165;
      const photoCenterY = 490;
      drawPhotoPlaceholder(width / 2, photoCenterY, photoRadius, themeColor);

      // Name
      const nameY = 745;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 56px sans-serif';
      ctx.fillText("${testData.nome.toUpperCase()}", width / 2, nameY);

      // Dates
      const datesY = 810;
      ctx.fillStyle = themeColor;
      ctx.font = '600 28px sans-serif';
      ctx.fillText("★ ${testData.nascimento}   ✦   ✝ ${testData.falecimento}", width / 2, datesY);

      // Separator
      ctx.strokeStyle = themeColor + '40';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 160, 845);
      ctx.lineTo(width / 2 + 160, 845);
      ctx.stroke();

      // Quote
      const quoteY = 910;
      ctx.fillStyle = '#E4E4E7';
      ctx.font = 'italic 400 32px serif';
      wrapText("“${testData.mensagem}”", width / 2, quoteY, 840, 46);

      // Ceremony Box (y=1140 to 1630, safely inside [150, 1770])
      const boxX = 88;
      const boxY = 1140;
      const boxW = width - 176;
      const boxH = 490;

      ctx.fillStyle = 'rgba(18, 18, 24, 0.88)';
      roundRect(boxX, boxY, boxW, boxH, 24);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#DC2626';
      ctx.font = '700 24px sans-serif';
      ctx.fillText('CERIMÔNIA DE DESPEDIDA', width / 2, boxY + 55);

      ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 120, boxY + 75);
      ctx.lineTo(width / 2 + 120, boxY + 75);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 28px sans-serif';
      ctx.fillText('Velório:', width / 2, boxY + 140);
      ctx.fillStyle = '#D1D5DB';
      ctx.font = '500 25px sans-serif';
      wrapText("${testData.velorio}", width / 2, boxY + 185, boxW - 80, 34);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 28px sans-serif';
      ctx.fillText('Sepultamento:', width / 2, boxY + 290);
      ctx.fillStyle = '#D1D5DB';
      ctx.font = '500 25px sans-serif';
      wrapText("${testData.sepultamento}", width / 2, boxY + 335, boxW - 80, 34);

      // Safe Footer (y=1720 < 1770)
      ctx.fillStyle = '#71717A';
      ctx.font = '500 22px sans-serif';
      ctx.fillText('Memorial Homenagens • Descanse em Paz', width / 2, 1720);

    } else {
      // Feed 3:4 Layout (1080 x 1440)
      const nameY = 250;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 52px sans-serif';
      ctx.fillText("${testData.nome.toUpperCase()}", width / 2, nameY);

      const datesY = 308;
      ctx.fillStyle = themeColor;
      ctx.font = '600 26px sans-serif';
      ctx.fillText("★ ${testData.nascimento}   ✦   ✝ ${testData.falecimento}", width / 2, datesY);

      ctx.strokeStyle = themeColor + '40';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 150, 338);
      ctx.lineTo(width / 2 + 150, 338);
      ctx.stroke();

      const photoRadius = 150;
      const photoCenterY = 550;
      drawPhotoPlaceholder(width / 2, photoCenterY, photoRadius, themeColor);

      const quoteY = 760;
      ctx.fillStyle = '#E4E4E7';
      ctx.font = 'italic 400 30px serif';
      wrapText("“${testData.mensagem}”", width / 2, quoteY, 840, 42);

      const boxX = 88;
      const boxY = 980;
      const boxW = width - 176;
      const boxH = 305;

      ctx.fillStyle = 'rgba(18, 18, 24, 0.85)';
      roundRect(boxX, boxY, boxW, boxH, 20);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#DC2626';
      ctx.font = '700 22px sans-serif';
      ctx.fillText('INFORMAÇÕES DE DESPEDIDA', width / 2, boxY + 45);

      ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 110, boxY + 62);
      ctx.lineTo(width / 2 + 110, boxY + 62);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 26px sans-serif';
      ctx.fillText("Velório: ${testData.velorio}", width / 2, boxY + 125);
      ctx.fillText("Sepultamento: ${testData.sepultamento}", width / 2, boxY + 205);

      ctx.fillStyle = '#71717A';
      ctx.font = '500 21px sans-serif';
      ctx.fillText('Memorial Homenagens • Que as lembranças sejam eterno consolo', width / 2, 1380);
    }

    function drawPhotoPlaceholder(cx, cy, radius, color) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#111116';
      ctx.fill();

      // Peace dove emblem vector fallback
      ctx.save();
      ctx.translate(cx, cy);
      const s = (radius * 0.85) / 100;
      ctx.scale(s, s);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, -10, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-35, 10, -30, 35);
      ctx.quadraticCurveTo(0, 30, 25, 15);
      ctx.quadraticCurveTo(15, 0, 0, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-10, -5);
      ctx.quadraticCurveTo(-45, -35, -20, -45);
      ctx.quadraticCurveTo(5, -30, 0, 5);
      ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(18, -12, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      // Double ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius - 7, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Mourning ribbon at bottom-right
      drawRibbon(cx + radius * 0.72, cy + radius * 0.72, '#111827');
    }

    function drawRibbon(x, y, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.ellipse(-15, -15, 25, 12, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(15, -15, 25, 12, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

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

      ctx.beginPath();
      ctx.arc(0, -5, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function drawCornerOrnaments(x, y, w, h, color, len) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
      ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
      ctx.moveTo(x + w, y + h - len); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - len, y + h);
      ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len);
      ctx.stroke();
      ctx.restore();
    }

    function wrapText(text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x, currentY);
    }

    function roundRect(x, y, width, height, radius) {
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
  </script>
</body>
</html>`;
}

function verifyPng(filePath, expectedW, expectedH) {
  if (!fs.existsSync(filePath)) {
    throw new Error('File ' + filePath + ' does not exist!');
  }
  const buf = fs.readFileSync(filePath);
  if (buf.length < 33) {
    throw new Error('File ' + filePath + ' is too small (' + buf.length + ' bytes)');
  }

  // PNG magic bytes
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 &&
                buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A;
  if (!isPng) {
    throw new Error('File ' + filePath + ' is not a valid PNG (bad header)');
  }

  // Parse IHDR
  const ihdrIndex = buf.indexOf(Buffer.from('IHDR'));
  if (ihdrIndex === -1) {
    throw new Error('File ' + filePath + ' missing IHDR chunk');
  }
  const width = buf.readUInt32BE(ihdrIndex + 4);
  const height = buf.readUInt32BE(ihdrIndex + 8);

  if (width !== expectedW || height !== expectedH) {
    throw new Error('Dimensions mismatch for ' + filePath + ': expected ' + expectedW + 'x' + expectedH + ', got ' + width + 'x' + height);
  }

  // Confirm IDAT chunk exists
  const hasIdat = buf.indexOf(Buffer.from('IDAT')) !== -1;
  if (!hasIdat) {
    throw new Error('File ' + filePath + ' missing IDAT chunk (incomplete image)');
  }

  // ffprobe validation
  const ffprobeOut = execSync(
    'ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of default=noprint_wrappers=1 ' + filePath
  ).toString().trim();

  return {
    path: filePath,
    sizeBytes: buf.length,
    width,
    height,
    ffprobe: ffprobeOut.replace(/\n/g, ', ')
  };
}

async function run() {
  const feedOutPath = path.join(TARGET_DIR, 'arte-feed-3x4.png');
  const feedAliasPath = path.join(TARGET_DIR, 'homenagem-feed-3x4.png');
  const storyOutPath = path.join(TARGET_DIR, 'arte-stories-9x16.png');
  const storyAliasPath = path.join(TARGET_DIR, 'homenagem-story-9x16.png');

  // 1. Render Feed 3:4 (1080 x 1440)
  console.log('\n[1/4] Renderizando Arte Feed 3:4 (1080x1440 — Solene Clássico Dourado)...');
  const feedHtml = buildRenderHtml('3:4', 'gold-classic-feed');
  const feedTempHtml = path.join(SCRATCH_DIR, 'feed_render.html');
  fs.writeFileSync(feedTempHtml, feedHtml);

  execFileSync(CHROMIUM_BIN, [
    '--headless=new',
    `--screenshot=${feedOutPath}`,
    '--window-size=1080,1440',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    `file://${feedTempHtml}`
  ]);

  fs.copyFileSync(feedOutPath, feedAliasPath);
  fs.unlinkSync(feedTempHtml);
  const feedRes = verifyPng(feedOutPath, 1080, 1440);
  console.log(`  ✓ Feed 3:4 gerado: ${feedRes.path}`);
  console.log(`  ✓ Resolução: ${feedRes.width}x${feedRes.height} px | Tamanho: ${feedRes.sizeBytes} bytes`);
  console.log(`  ✓ ffprobe: ${feedRes.ffprobe}`);

  // 2. Render Stories 9:16 (1080 x 1920 com Safe Area de 150px)
  console.log('\n[2/4] Renderizando Arte Stories 9:16 (1080x1920 — Luz de Vela Noturna)...');
  const storyHtml = buildRenderHtml('9:16', 'candle-light-story');
  const storyTempHtml = path.join(SCRATCH_DIR, 'story_render.html');
  fs.writeFileSync(storyTempHtml, storyHtml);

  execFileSync(CHROMIUM_BIN, [
    '--headless=new',
    `--screenshot=${storyOutPath}`,
    '--window-size=1080,1920',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    `file://${storyTempHtml}`
  ]);

  fs.copyFileSync(storyOutPath, storyAliasPath);
  fs.unlinkSync(storyTempHtml);
  const storyRes = verifyPng(storyOutPath, 1080, 1920);
  console.log(`  ✓ Stories 9:16 gerado: ${storyRes.path}`);
  console.log(`  ✓ Resolução: ${storyRes.width}x${storyRes.height} px | Tamanho: ${storyRes.sizeBytes} bytes`);
  console.log(`  ✓ ffprobe: ${storyRes.ffprobe}`);

  // 3. Python Pillow Inspection
  console.log('\n[3/4] Verificando integridade com Python Pillow (PIL)...');
  const pyVerify = `
import os
from PIL import Image

f_feed = "${feedOutPath}"
f_story = "${storyOutPath}"

im_f = Image.open(f_feed)
im_s = Image.open(f_story)

print(f"PIL Feed: {im_f.format} {im_f.size} {im_f.mode}")
print(f"PIL Story: {im_s.format} {im_s.size} {im_s.mode}")

assert im_f.size == (1080, 1440), f"Dimensões do Feed incorretas: {im_f.size}"
assert im_s.size == (1080, 1920), f"Dimensões do Stories incorretas: {im_s.size}"
print("PIL Verification: APROVADO")
`;
  const pyTemp = path.join(SCRATCH_DIR, 'pil_verify.py');
  fs.writeFileSync(pyTemp, pyVerify);
  const pyOut = execSync(`python3 ${pyTemp}`).toString().trim();
  fs.unlinkSync(pyTemp);
  console.log(pyOut.split('\n').map(l => '  ' + l).join('\n'));

  // 4. Final Summary
  console.log('\n[4/4] Sumário de Entrega dos Artefatos:');
  console.log(`  • Feed 3:4:    ${feedOutPath} (1080x1440)`);
  console.log(`  • Stories 9:16: ${storyOutPath} (1080x1920, Safe Area 150px)`);
  console.log(`  • Total arquivos em ${TARGET_DIR}: ${fs.readdirSync(TARGET_DIR).length}`);
  console.log('\n✓ TESTE AUTOMATIZADO CONCLUÍDO COM SUCESSO (EXIT 0)');
}

run().catch((err) => {
  console.error('\n❌ FALHA NO TESTE DE RENDERIZAÇÃO:', err);
  process.exit(1);
});
