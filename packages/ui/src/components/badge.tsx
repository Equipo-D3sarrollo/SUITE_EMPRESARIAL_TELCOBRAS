import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

/** Etiqueta neutra para categorías y contadores ("Mensual", "6 registrados"). */
export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-tb-gris bg-tb-superficie px-2 py-0.5 font-medium text-tb-texto text-xs [&_svg]:size-3.5 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  );
}
