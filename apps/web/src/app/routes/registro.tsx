import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '@/features/auth/register-page';
import { parseRedirect, redirectIfSignedIn, requireSession } from '../guards';

export const Route = createFileRoute('/registro')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string; paso?: 'passkey' } => ({
    redirect: parseRedirect(search.redirect),
    paso: search.paso === 'passkey' ? 'passkey' : undefined,
  }),
  // El paso de la passkey llega con la sesión que abrió el enlace de verificación del correo.
  beforeLoad: ({ context, search, location }) =>
    search.paso === 'passkey'
      ? requireSession(context.queryClient, location.href)
      : redirectIfSignedIn(context.queryClient, search.redirect),
  component: RegisterPage,
});
