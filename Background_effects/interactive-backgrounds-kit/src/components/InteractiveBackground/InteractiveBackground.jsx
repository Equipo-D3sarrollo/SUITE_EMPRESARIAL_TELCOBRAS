import { useEffect, useRef } from 'react';
import { createEngine, DEFAULTS } from './engine.js';

/**
 * Fondo interactivo en <canvas>. Colócalo DENTRO de un contenedor con position: relative
 * (o usa la prop `fixed` para cubrir toda la ventana) y pon el contenido encima con z-index mayor.
 *
 * Props: variant, density, intensity, radius, autoplay, interactive, color, hue, fixed, className, style
 * Variantes: grid | constellation | flow | ripple | aurora | flicker | magnet | star | mesh | hex | terrain | orbit | spot
 */
export default function InteractiveBackground({
  variant = DEFAULTS.variant,
  density = DEFAULTS.density,
  intensity = DEFAULTS.intensity,
  radius = DEFAULTS.radius,
  autoplay = DEFAULTS.autoplay,
  interactive = DEFAULTS.interactive,
  color = DEFAULTS.color,
  hue = DEFAULTS.hue,
  fixed = false,
  className,
  style,
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const mounted = useRef(false);
  const opts = { variant, density, intensity, radius, autoplay, interactive, color, hue };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    engineRef.current = createEngine(canvas, opts); // null en jsdom / sin canvas 2D
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; } // el motor ya nació con estas opciones
    engineRef.current?.setOptions(opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, density, intensity, radius, autoplay, interactive, color, hue]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: fixed ? 'fixed' : 'absolute',
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
