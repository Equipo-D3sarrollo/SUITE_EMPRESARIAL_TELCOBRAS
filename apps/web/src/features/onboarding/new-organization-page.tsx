import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Badge, Button } from '@telcobras/ui';
import { ArrowLeft, UserRound } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { sessionQuery } from '@/lib/queries';
import { Logo } from '@/shell/zone0-topbar/logo';
import { OrganizationForm } from './organization-form';

/**
 * /organizaciones/nueva: registra una organización más con la cuenta de la sesión (una persona, varias
 * empresas). Mismo marco que /onboarding. La guarda exige al menos una organización, así que siempre
 * hay un panel al que volver.
 */
export function NewOrganizationPage() {
  // Sin suspense: la guarda ya cargó la sesión.
  const { data: session } = useQuery(sessionQuery);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-20 shrink-0 items-center border-tb-gris/40 border-b px-6">
        <Logo withSlogan />
      </header>
      <main id="main-content" className="flex flex-1 flex-col items-center gap-6 p-6">
        <div className="w-full max-w-3xl">
          <Button asChild variant="ghost" size="sm">
            <Link to="/app">
              <ArrowLeft aria-hidden="true" />
              {t.newOrganization.back}
            </Link>
          </Button>
        </div>
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
          {session && (
            <Badge className="max-w-full border-tb-azul">
              <UserRound aria-hidden="true" className="text-tb-azul" />
              <span className="truncate">{t.newOrganization.account(session.user.email)}</span>
            </Badge>
          )}
          <h1 className="font-semibold text-3xl">{t.newOrganization.title}</h1>
          <p className="text-sm">{t.newOrganization.description}</p>
        </div>
        <OrganizationForm />
      </main>
    </div>
  );
}
