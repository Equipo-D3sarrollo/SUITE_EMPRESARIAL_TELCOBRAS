import { Card } from '@telcobras/ui';
import { ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { t } from '@/i18n/es-CO';
import { Logo } from '@/shell/zone0-topbar/logo';

/** Marco de las pantallas de acceso (Stitch: inicio de sesión y registro simple): formulario a la izquierda, beneficios a la derecha. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-20 shrink-0 items-center border-tb-gris/40 border-b px-6">
        <Logo withSlogan />
      </header>
      <main id="main-content" className="flex flex-1 items-center justify-center p-6">
        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <Card className="p-8">{children}</Card>
          <aside className="flex flex-col gap-4">
            <h2 className="font-semibold text-xl">{t.auth.sidePanel.title}</h2>
            <p className="text-sm">{t.auth.sidePanel.description}</p>
            <ul className="flex flex-col gap-3">
              {t.auth.sidePanel.features.map((feature) => (
                <li key={feature.title} className="flex gap-3">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-tb-azul" />
                  <span className="flex flex-col">
                    <span className="font-medium text-sm">{feature.title}</span>
                    <span className="text-sm">{feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <footer className="px-6 py-4 text-xs">{t.brand.copyright(new Date().getFullYear())}</footer>
    </div>
  );
}

/** Separador "o" entre Google y el correo. */
export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase">
      <span aria-hidden="true" className="h-px flex-1 bg-tb-gris/40" />
      {t.auth.or}
      <span aria-hidden="true" className="h-px flex-1 bg-tb-gris/40" />
    </div>
  );
}
