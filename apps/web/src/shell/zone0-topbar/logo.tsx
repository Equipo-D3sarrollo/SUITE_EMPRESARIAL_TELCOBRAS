import { cn } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';

type LogoProps = {
  /** El eslogan solo se muestra donde cabe a 12 px o más (pantallas de acceso), nunca en la Zona 0. */
  withSlogan?: boolean;
  className?: string;
};

/** Logo oficial de Telcobras recreado en SVG con la paleta de la suite (documento madre §12.4.1). */
export function Logo({ withSlogan = false, className }: LogoProps) {
  return (
    <svg
      role="img"
      aria-label={withSlogan ? `${t.brand.name}. ${t.brand.slogan}` : t.brand.name}
      viewBox={withSlogan ? '0 0 248 60' : '0 0 206 44'}
      className={cn('w-auto shrink-0', className)}
    >
      {/* Marca: tres velas superpuestas, verde, amarilla y azul. */}
      <path d="M2 8 13 2v38L2 44Z" className="fill-tb-verde" />
      <path d="M10 12 19 7v33l-9 4Z" className="fill-tb-amarillo" />
      <path d="M17 16 26 11v28l-9 4Z" className="fill-tb-azul" />
      <text x="34" y="33" fontSize="30" fontWeight="600" fontStyle="italic" letterSpacing="-0.5">
        <tspan className="fill-tb-azul">TELCO</tspan>
        <tspan className="fill-tb-verde">BRAS</tspan>
      </text>
      {withSlogan && (
        <text x="34" y="54" fontSize="12.5" textLength="210" className="fill-tb-negro">
          {t.brand.slogan}
        </text>
      )}
    </svg>
  );
}
