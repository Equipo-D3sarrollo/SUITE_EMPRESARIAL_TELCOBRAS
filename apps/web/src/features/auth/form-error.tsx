import { CircleAlert } from 'lucide-react';

/** Error de un formulario completo: rojo solo con icono y texto (documento madre §12.4.1), anunciado al aparecer. */
export function FormError({ children }: { children: string }) {
  return (
    <p
      role="alert"
      className="flex items-center gap-1.5 text-sm text-tb-error dark:text-tb-texto dark:[&_svg]:text-tb-error"
    >
      <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
      {children}
    </p>
  );
}
