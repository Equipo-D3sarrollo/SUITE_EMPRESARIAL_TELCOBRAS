import * as SwitchPrimitive from '@radix-ui/react-switch';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';
import { focusRing } from '../lib/styles';

// Encendido en azul y apagado en gris: ambos superan 3:1 sobre blanco; el verde (2,2:1) no alcanzaría.
export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-tb-gris transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-tb-azul',
        focusRing,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-4 rounded-full bg-tb-blanco shadow-sm transition-transform data-[state=checked]:translate-x-4 motion-reduce:transition-none" />
    </SwitchPrimitive.Root>
  );
}
