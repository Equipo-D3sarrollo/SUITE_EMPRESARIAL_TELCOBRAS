import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';
import { floatingSurface } from '../lib/styles';

/** Va una sola vez en la raíz de la app. */
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(floatingSurface, 'max-w-xs px-2 py-1 text-xs shadow-md', className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
