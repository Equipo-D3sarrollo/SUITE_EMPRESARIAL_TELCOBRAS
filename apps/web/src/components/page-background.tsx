import { useEffect, useState } from 'react';
import {
  type BackgroundVariant,
  InteractiveBackground,
  variants,
} from './interactive-backgrounds';

const ROTATION_MS = 30_000;

/** Colores oficiales de Telcobras, según el Documento Madre §12.4.1. */
export const BRAND_COLORS = ['#88BD4C', '#2491CC', '#F3CB35'] as const;

/** Fondo sutil para las pantallas de la aplicación. */
export function PageBackground() {
  const [variantIndex, setVariantIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (prefersReducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setVariantIndex((current) => (current + 1) % variants.length);
      setColorIndex((current) => (current + 1) % BRAND_COLORS.length);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, []);

  const variant = variants[variantIndex] as BackgroundVariant;
  const color = BRAND_COLORS[colorIndex];
  const changeVariant = () => {
    setVariantIndex((current) => (current + 1) % variants.length);
    setColorIndex((current) => (current + 1) % BRAND_COLORS.length);
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      data-testid="page-background"
    >
      <InteractiveBackground
        variant={variant}
        density={0.75}
        intensity={1.0}
        radius={0.9}
        autoplay={false}
        interactive
        className="opacity-100"
        color={color}
      />
      <button
        type="button"
        onClick={changeVariant}
        aria-label="Cambiar fondo interactivo"
        title="Cambiar fondo interactivo"
        className="pointer-events-auto absolute right-4 top-4 z-10 rounded border border-tb-gris/50 bg-tb-blanco/85 px-2 py-1 text-xs text-tb-azul shadow-sm backdrop-blur-sm transition hover:bg-tb-blanco focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tb-azul"
      >
        Cambiar fondo
      </button>
    </div>
  );
}

export { ROTATION_MS };
