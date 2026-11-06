import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';
import { fieldControl } from '../lib/styles';

export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return <input type={type} className={cn(fieldControl, className)} {...props} />;
}
