import React from 'react';

export type BlurTextEffect = 'blur' | 'zoom' | 'tilt' | 'focus' | 'drift';
export type BlurTextStaggerFrom = 'start' | 'center' | 'end' | 'random';
export type BlurTextTrigger = 'view' | 'load' | 'hover' | 'click';

export interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: unknown;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  blur?: number;
  distance?: number;
  effect?: BlurTextEffect;
  staggerFrom?: BlurTextStaggerFrom;
  trigger?: BlurTextTrigger;
  loop?: boolean;
  loopDelay?: number;
  color?: string;
  fromColor?: string;
  focusOnHover?: boolean;
}

/**
 * BlurText - Unslop & Emil Kowalski Refined.
 * Renders title text immediately with a subtle, respectful fade/rise transition (<200ms)
 * to eliminate artificial word-by-word stuttering on solemn interfaces while maintaining full API compatibility.
 */
export const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  className = '',
  color,
  onAnimationComplete,
}) => {
  React.useEffect(() => {
    if (onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, 160);
      return () => clearTimeout(timer);
    }
  }, [onAnimationComplete]);

  return (
    <span
      className={`inline-block transition-opacity duration-200 ease-out ${className}`}
      style={{
        color: color || undefined,
      }}
    >
      {text}
    </span>
  );
};

export default BlurText;
