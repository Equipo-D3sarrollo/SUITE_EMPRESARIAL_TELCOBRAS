import { cn } from '@telcobras/ui';
import { type AnimationEvent, useState } from 'react';
import { t } from '@/i18n/es-CO';

type LogoProps = {
  /** El eslogan solo se muestra donde cabe a 12 px o más (pantallas de acceso), nunca en la Zona 0. */
  withSlogan?: boolean;
  className?: string;
};

/**
 * Logotipo provisional de OrveX.IA: solo el nombre, con un barrido de luz, mientras llega el logo
 * definitivo. Los efectos viven en styles.css (.orvex-*) y se apagan con prefers-reduced-motion.
 */
export function Logo({ withSlogan = false, className }: LogoProps) {
  // Cada barrido es una sola pasada con su pausa como retraso (styles.css). Al terminar se alterna el
  // nombre de la animación para lanzar la siguiente: la pausa no cuesta fotogramas al navegador.
  const [alternateSweep, setAlternateSweep] = useState(false);

  function restartSweep(event: AnimationEvent<HTMLSpanElement>) {
    // Solo el barrido del nombre; las animaciones de la X y el punto son infinitas y no terminan.
    if (event.target === event.currentTarget) setAlternateSweep((current) => !current);
  }

  return (
    <span
      role="img"
      aria-label={withSlogan ? `${t.brand.name}. ${t.brand.slogan}` : t.brand.name}
      className={cn(
        'orvex-wordmark inline-flex shrink-0 select-none flex-col justify-center leading-none',
        withSlogan ? 'text-3xl' : 'text-2xl',
        className,
      )}
    >
      {/* El punto es un indicador luminoso, no el carácter ".": el nombre accesible está en aria-label. */}
      <span
        aria-hidden="true"
        className={cn('orvex-name', alternateSweep && 'orvex-name--b')}
        onAnimationEnd={restartSweep}
      >
        Orve<span className="orvex-x">X</span>
        <span className="orvex-dot" />
        IA
      </span>
      {withSlogan && (
        <span
          aria-hidden="true"
          className="mt-1.5 font-normal text-tb-negro/70 text-xs tracking-wide"
        >
          {t.brand.slogan}
        </span>
      )}
    </span>
  );
}
