import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Move } from 'lucide-react';

interface ImageTouchModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onConfirm: (croppedDataUrl: string) => void;
  aspectRatio?: number; // e.g. 1 for square (avatar), 3/4 for feed, 9/16 for story
  title?: string;
}

export const ImageTouchModal: React.FC<ImageTouchModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onConfirm,
  aspectRatio = 1,
  title = 'Ajustar Enquadramento'
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset when image changes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Touch handlers for mobile pan & pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDist.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y
      });
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / lastTouchDist.current;
      setScale((prev) => Math.min(Math.max(prev * factor, 0.8), 4));
      lastTouchDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDist.current = null;
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle Export / Crop using Canvas
  const handleApply = () => {
    if (!imageRef.current || !containerRef.current) {
      onConfirm(imageSrc);
      onClose();
      return;
    }

    const img = imageRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Canvas size
    const outWidth = 800;
    const outHeight = Math.round(800 / aspectRatio);
    const canvas = document.createElement('canvas');
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      onConfirm(imageSrc);
      onClose();
      return;
    }

    // Fill dark background
    ctx.fillStyle = '#0C0C0F';
    ctx.fillRect(0, 0, outWidth, outHeight);

    // Calculate transformation
    const ratioX = outWidth / containerRect.width;
    const ratioY = outHeight / containerRect.height;

    ctx.save();
    ctx.translate(outWidth / 2, outHeight / 2);
    ctx.translate(position.x * ratioX, position.y * ratioY);
    ctx.scale(scale, scale);

    // Draw image centered
    const drawW = img.width * ratioX;
    const drawH = img.height * ratioY;
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const cropped = canvas.toDataURL('image/jpeg', 0.92);
    onConfirm(cropped);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="relative w-full max-w-lg bg-surface border border-hairline rounded-3xl shadow-2xl overflow-hidden card-tactile flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-elevated">
          <div className="flex items-center space-x-2">
            <Move className="w-5 h-5 text-accent-wine" />
            <h3 className="text-base font-bold text-primary tracking-tight font-sans">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-secondary hover:text-primary rounded-xl hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framing Instructions */}
        <div className="px-6 py-2 bg-surface-elevated/70 border-b border-hairline flex items-center justify-between text-xs text-secondary font-sans">
          <span>Arraste para mover • Pinça ou botões para zoom</span>
          <span className="text-accent-wine font-mono font-bold">Zoom: {Math.round(scale * 100)}%</span>
        </div>

        {/* Viewport Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] select-none touch-none">
          {/* Aspect Ratio Box Mask */}
          <div
            ref={containerRef}
            className="relative overflow-hidden border-2 border-dashed border-red-500/70 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.25)]"
            style={{
              width: aspectRatio >= 1 ? '280px' : `${280 * aspectRatio}px`,
              height: aspectRatio >= 1 ? `${280 / aspectRatio}px` : '320px',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Ajuste"
              draggable={false}
              className="absolute pointer-events-none transition-transform duration-75 max-w-none"
              style={{
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                left: '50%',
                top: '50%',
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="p-4 sm:p-5 bg-surface-elevated border-t border-hairline flex flex-col space-y-3 font-sans">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setScale((s) => Math.max(s - 0.15, 0.6))}
              className="p-2 btn-tactile text-secondary hover:text-primary rounded-xl cursor-pointer"
              title="Diminuir Zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 accent-red-600 cursor-pointer h-2 bg-surface rounded-lg"
            />
            <button
              onClick={() => setScale((s) => Math.min(s + 0.15, 3))}
              className="p-2 btn-tactile text-secondary hover:text-primary rounded-xl cursor-pointer"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="p-2 btn-tactile text-secondary hover:text-primary rounded-xl cursor-pointer"
              title="Resetar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-secondary btn-tactile hover:text-primary cursor-pointer font-sans"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold btn-tactile-white flex items-center justify-center space-x-2 cursor-pointer font-sans shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Enquadramento</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
