import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '@/features/auth/register-page';
import { parseRedirect, redirectIfSignedIn } from '../guards';

export const Route = createFileRoute('/registro')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: parseRedirect(search.redirect),
  }),
  // El paso del código vive en el estado de la página: la sesión se abre al verificarlo.
  beforeLoad: ({ context, search }) => redirectIfSignedIn(context.queryClient, search.redirect),
  component: RegisterPage,
});
