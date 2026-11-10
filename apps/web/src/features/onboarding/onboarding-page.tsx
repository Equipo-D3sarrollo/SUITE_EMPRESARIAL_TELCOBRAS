import { Badge } from '@telcobras/ui';
import { Timer } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { Logo } from '@/shell/zone0-topbar/logo';
import { OrganizationForm } from './organization-form';

/** /onboarding simplificado (Stitch: configuración simplificada de empresa): crea la organización y entra al panel. */
export function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-20 shrink-0 items-center border-tb-gris/40 border-b px-6">
        <Logo withSlogan />
      </header>
      <main id="main-content" className="flex flex-1 flex-col items-center gap-6 p-6">
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
          <Badge className="border-tb-azul">
            <Timer aria-hidden="true" className="text-tb-azul" />
            {t.onboarding.badge}
          </Badge>
          <h1 className="font-semibold text-3xl">{t.onboarding.title}</h1>
          <p className="text-sm">{t.onboarding.description}</p>
        </div>
        <OrganizationForm />
      </main>
    </div>
  );
}
