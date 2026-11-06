import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';
import { focusRing } from '../lib/styles';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('flex items-end gap-4 border-tb-gris/40 border-b', className)}
      {...props}
    />
  );
}

// Pestaña activa: subrayado azul de 2 px. El peso no cambia para que las pestañas no salten.
export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        '-mb-px inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-transparent border-b-2 px-1 pt-1 pb-2 font-medium text-sm text-tb-negro transition-colors hover:border-tb-gris disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-tb-azul [&_svg]:size-4',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('pt-4', focusRing, className)} {...props} />;
}
