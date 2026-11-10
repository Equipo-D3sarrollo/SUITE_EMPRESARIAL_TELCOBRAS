import { createFileRoute } from '@tanstack/react-router';
import { NewOrganizationPage } from '@/features/onboarding/new-organization-page';
import { requireOrganization, requireSession } from '../guards';

// Fuera de /app a propósito: pantalla completa, sin el shell. Exige sesión (la organización se crea con
// la cuenta actual) y al menos una organización: sin ninguna, el primer ingreso va a /onboarding, con
// sus textos de primera vez (regla inversa de /onboarding, que devuelve al panel si ya hay alguna).
export const Route = createFileRoute('/organizaciones/nueva')({
  beforeLoad: async ({ context, location }) => {
    await requireSession(context.queryClient, location.href);
    await requireOrganization(context.queryClient);
  },
  component: NewOrganizationPage,
});
