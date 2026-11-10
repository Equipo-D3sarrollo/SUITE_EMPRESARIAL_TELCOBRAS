import { Slot } from '@radix-ui/react-slot';
import { type ComponentProps, type PointerEvent, useRef, useState } from 'react';
import { cn } from '../lib/cn';

type Ripple = { id: number; x: number; y: number };

/**
 * Tarjeta de la suite. Superficie blanca al 20 % (80 % de transparencia) para que se vea el fondo
 * interactivo de la Zona 2: es un color con alfa, no `opacity`, así que el contenido se ve al 100 %.
 *
 * Todas las tarjetas llevan el efecto "haz con cola + onda al clic" (estilos .tail-ripple* en
 * theme.css): un haz recorre el borde y, al hacer clic, nace una onda en ese punto y el contorno
 * destella. Es decoración: no cambia el contenido ni el comportamiento, y con
 * prefers-reduced-motion el haz se detiene y la onda casi no se ve.
 */
export function Card({ className, children, onPointerDown, ...props }: ComponentProps<'div'>) {
  const nextRippleId = useRef(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [flashKey, setFlashKey] = useState(0);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple: Ripple = {
      id: nextRippleId.current++,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setRipples((current) => [...current, ripple]);
    setFlashKey((key) => key + 1);
    onPointerDown?.(event);
  }

  function removeRipple(id: number) {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  }

  return (
    <div
      className={cn(
        'tail-ripple rounded-lg border border-tb-gris/40 bg-tb-blanco/20 backdrop-blur-sm shadow-sm',
        className,
      )}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {children}
      {/* Capas decorativas: no reciben clics ni las lee el lector de pantalla. */}
      {flashKey > 0 && <span key={flashKey} aria-hidden="true" className="tail-ripple__flash" />}
      <span aria-hidden="true" className="tail-ripple__waves">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="tail-ripple__wave"
            style={{ left: ripple.x, top: ripple.y }}
            onAnimationEnd={() => removeRipple(ripple.id)}
          />
        ))}
      </span>
    </div>
  );
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1 p-4', className)} {...props} />;
}

/** Con asChild se le da el nivel de encabezado que corresponda: <CardTitle asChild><h2>…</h2></CardTitle>. */
export function CardTitle({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';
  return <Comp className={cn('font-semibold text-base', className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('text-sm', className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-4 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center gap-2 p-4 pt-0', className)} {...props} />;
}
