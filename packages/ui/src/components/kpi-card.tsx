import { type LucideIcon, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { type ComponentProps, type ReactNode, useId } from 'react';
import { cn } from '../lib/cn';
import { Card } from './card';

const trendIcons = { up: TrendingUp, down: TrendingDown, flat: Minus } satisfies Record<
  string,
  LucideIcon
>;

export type KpiDelta = {
  /** Variación ya formateada con signo, por ejemplo "+18,4 %". */
  value: string;
  trend: keyof typeof trendIcons;
  /** Contexto de la variación, por ejemplo "vs. mes anterior". */
  label?: string;
};

export type KpiCardProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: string;
  /** Valor ya formateado (COP, %, conteo); puede incluir la unidad en un <span>. */
  value: ReactNode;
  icon?: LucideIcon;
  delta?: KpiDelta;
  /** Fila inferior, por ejemplo "Ticket promedio" y su valor. */
  footer?: ReactNode;
};

// La variación va en negro con icono de tendencia: subir no siempre es bueno, así que no se colorea.
export function KpiCard({
  title,
  value,
  icon: Icon,
  delta,
  footer,
  className,
  ...props
}: KpiCardProps) {
  const titleId = useId();
  const TrendIcon = delta && trendIcons[delta.trend];

  return (
    <Card
      role="group"
      aria-labelledby={titleId}
      className={cn('flex flex-col gap-2 p-4', className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <p id={titleId} className="font-medium text-xs uppercase tracking-wide">
          {title}
        </p>
        {Icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-tb-azul/10 text-tb-azul">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        )}
      </div>
      <p className="font-semibold text-2xl tabular-nums">{value}</p>
      {delta && TrendIcon && (
        <p className="flex items-center gap-1 text-xs">
          <TrendIcon aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="font-semibold tabular-nums">{delta.value}</span>
          {delta.label && <span>{delta.label}</span>}
        </p>
      )}
      {footer && (
        <div className="mt-auto flex items-center justify-between gap-2 border-tb-gris/30 border-t pt-2 text-xs tabular-nums">
          {footer}
        </div>
      )}
    </Card>
  );
}
