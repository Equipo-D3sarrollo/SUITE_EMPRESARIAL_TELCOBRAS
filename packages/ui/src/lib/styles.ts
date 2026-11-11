/** Foco visible: contorno azul de 2 px (3,5:1 sobre blanco, cumple WCAG 2.4.7 y 1.4.11). */
export const focusRing = 'outline-tb-azul focus-visible:outline-2 focus-visible:outline-offset-2';

/** Controles de formulario: 34 px de alto y borde gris sólido (3,4:1, el mínimo de 3:1 para controles). */
export const fieldControl = `h-8.5 w-full min-w-0 rounded-sm border border-tb-gris bg-tb-superficie px-3 text-sm text-tb-texto placeholder:text-tb-texto/60 aria-[invalid=true]:border-tb-error disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

/** Superficies flotantes (popover, menú, tooltip): fondo blanco, texto negro y fade al abrir. */
export const floatingSurface =
  'z-50 rounded-lg border border-tb-gris/40 bg-tb-superficie text-tb-texto shadow-lg outline-none motion-safe:animate-fade-in';
