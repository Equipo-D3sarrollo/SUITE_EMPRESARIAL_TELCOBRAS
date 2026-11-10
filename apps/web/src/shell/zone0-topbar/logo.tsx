import { cn } from '@telcobras/ui';
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
      <span aria-hidden="true" className="orvex-name">
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
