import * as SeparatorPrimitive from '@radix-ui/react-separator';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'shrink-0 bg-tb-gris/40 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
        className,
      )}
      {...props}
    />
  );
}
