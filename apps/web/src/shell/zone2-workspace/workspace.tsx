import type { ReactNode } from 'react';
import { t } from '@/i18n/es-CO';

type WorkspaceProps = {
  /** Cambia con la ruta: al remontar el contenido se repite el fade de 0,15 s (documento madre §12.1). */
  routeKey: string;
  /** Texto pequeño sobre el título, por ejemplo el módulo. */
  eyebrow?: ReactNode;
  title: ReactNode;
  children: ReactNode;
};

/** Zona 2: área principal (~72 %) con scroll propio. Destino del enlace "Saltar al contenido principal". */
export function Workspace({ routeKey, eyebrow, title, children }: WorkspaceProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label={t.shell.regions.workspace}
      className="min-w-0 basis-[72%] overflow-y-auto p-6 outline-none"
    >
      {/* animate-fade-in viene del tema; motion-safe lo quita con prefers-reduced-motion. */}
      <div key={routeKey} className="space-y-6 motion-safe:animate-fade-in">
        <header>
          {eyebrow && <p className="text-sm">{eyebrow}</p>}
          <h1 className="font-semibold text-2xl">{title}</h1>
        </header>
        {children}
      </div>
    </main>
  );
}
