import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

/** Bloque de carga con la forma del contenido. Es decorativo: el contenedor que carga lleva aria-busy. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-sm bg-tb-gris/20 motion-safe:animate-pulse', className)}
      {...props}
    />
  );
}
