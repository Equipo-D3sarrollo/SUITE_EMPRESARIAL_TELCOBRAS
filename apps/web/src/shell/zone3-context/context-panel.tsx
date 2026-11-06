import type { ReactNode } from 'react';
import { t } from '@/i18n/es-CO';

/** Zona 3: panel contextual (~28 %) con scroll propio, fondo blanco y borde gris. */
export function ContextPanel({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return (
    <aside
      aria-label={t.shell.regions.context}
      className="min-w-0 basis-[28%] overflow-y-auto border-tb-gris/40 border-l bg-tb-blanco p-5"
    >
      <div key={routeKey} className="space-y-4 motion-safe:animate-fade-in">
        {children}
      </div>
    </aside>
  );
}
