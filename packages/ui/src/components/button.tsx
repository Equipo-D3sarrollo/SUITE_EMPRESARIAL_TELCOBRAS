import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';
import { focusRing } from '../lib/styles';

const buttonVariants = cva(
  `inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm border font-medium text-tb-negro transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 ${focusRing}`,
  {
    variants: {
      variant: {
        // Verde solo como fondo, con texto negro (9,4:1).
        primary: 'border-tb-verde bg-tb-verde hover:bg-tb-verde/85',
        secondary: 'border-tb-azul bg-tb-blanco hover:bg-tb-azul/10',
        ghost: 'border-transparent bg-transparent hover:bg-tb-gris/15',
        // El rojo sirve como texto (5,6:1 sobre blanco); el texto blanco pequeño no está permitido.
        destructive: 'border-tb-error bg-tb-blanco text-tb-error hover:bg-tb-error/10',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9.5 px-4 text-sm',
        icon: 'size-9.5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Aplica el estilo al hijo (por ejemplo, un enlace del router) en lugar de renderizar un <button>. */
    asChild?: boolean;
  };

/** Botón de la suite. Con size="icon" hay que pasar aria-label. */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
