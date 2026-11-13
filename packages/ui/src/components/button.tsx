import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';
import { focusRing } from '../lib/styles';

const buttonVariants = cva(
  `inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm border font-medium text-tb-texto transition-colors disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 ${focusRing}`,
  {
    variants: {
      variant: {
        // Verde solo como fondo, con texto negro (9,4:1) también en modo oscuro.
        primary: 'border-tb-verde bg-tb-verde text-tb-negro hover:bg-tb-verde/85',
        // Azul y amarillo solo como fondo, con texto negro (≈ 6:1 y ≈ 13:1). Los usan los eventos
        // RADIAN 030 y 032 (ADR-007: la paleta no tiene naranja, el 032 pasa al amarillo).
        info: 'border-tb-azul bg-tb-azul text-tb-negro hover:bg-tb-azul/85',
        accent: 'border-tb-amarillo bg-tb-amarillo text-tb-negro hover:bg-tb-amarillo/85',
        secondary: 'border-tb-azul bg-tb-superficie hover:bg-tb-azul/10',
        ghost: 'border-transparent bg-transparent hover:bg-tb-gris/15',
        // El rojo sirve como texto (5,6:1 sobre blanco); el texto blanco pequeño no está permitido.
        // En oscuro el rojo sobre negro no llega a 4,5:1: pasa a relleno rojo con texto blanco (5,6:1).
        destructive:
          'border-tb-error bg-tb-superficie text-tb-error hover:bg-tb-error/10 dark:bg-tb-error dark:text-tb-blanco dark:hover:bg-tb-error/85',
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
