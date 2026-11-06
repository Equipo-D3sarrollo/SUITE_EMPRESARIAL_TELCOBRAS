import { Circle, CircleCheck, CircleX, Info, type LucideIcon, TriangleAlert } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Badge } from './badge';

// El significado nunca depende solo del color: cada estado lleva su icono y el texto es obligatorio.
const statusStyles = {
  ok: { icon: CircleCheck, className: 'border-tb-verde bg-tb-verde' },
  warning: { icon: TriangleAlert, className: 'border-tb-amarillo bg-tb-amarillo' },
  error: { icon: CircleX, className: 'border-tb-error text-tb-error' },
  info: { icon: Info, className: 'border-tb-azul [&_svg]:text-tb-azul' },
  neutral: { icon: Circle, className: 'border-tb-gris [&_svg]:text-tb-gris' },
} satisfies Record<string, { icon: LucideIcon; className: string }>;

export type Status = keyof typeof statusStyles;

export type StatusBadgeProps = ComponentProps<'span'> & {
  status: Status;
  children: ReactNode;
};

export function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  const { icon: Icon, className: statusClassName } = statusStyles[status];
  return (
    <Badge className={cn(statusClassName, className)} {...props}>
      <Icon aria-hidden="true" />
      {children}
    </Badge>
  );
}
