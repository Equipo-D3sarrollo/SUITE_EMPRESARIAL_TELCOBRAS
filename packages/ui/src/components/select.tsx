import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';
import { fieldControl } from '../lib/styles';

/** Select nativo: accesible y con teclado del sistema sin JavaScript. Las opciones van como <option>. */
export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(fieldControl, 'pr-2', className)} {...props} />;
}
