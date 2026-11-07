import { useEffect, useRef } from 'react';
import { createEngine, DEFAULTS } from './engine.js';
import { variants } from './effects.js';

type Variant = (typeof variants)[number];

type InteractiveBackgroundProps = {
  variant?: Variant;
  density?: number;
  intensity?: number;
  radius?: number;
  autoplay?: boolean;
  interactive?: boolean;
  color?: string | null;
  hue?: number;
  className?: string;
  style?: React.CSSProperties;
};

/** Canvas decorativo basado en el kit de fondos interactivos. */
export function InteractiveBackground({
  variant = DEFAULTS.variant as Variant,
  density = DEFAULTS.density,
  intensity = DEFAULTS.intensity,
  radius = DEFAULTS.radius,
  autoplay = DEFAULTS.autoplay,
  interactive = DEFAULTS.interactive,
  color = DEFAULTS.color,
  hue = DEFAULTS.hue,
  className,
  style,
}: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof createEngine>>(null);
  const mounted = useRef(false);
  const options = { variant, density, intensity, radius, autoplay, interactive, color, hue };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    engineRef.current = createEngine(canvas, options);
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
      mounted.current = false;
    };
    // The engine is initialized once and updated by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    engineRef.current?.setOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, density, intensity, radius, autoplay, interactive, color, hue]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  );
}

export { variants };
export default InteractiveBackground;
