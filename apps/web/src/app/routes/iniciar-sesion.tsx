import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '@/features/auth/login-page';
import { parseRedirect, redirectIfSignedIn } from '../guards';

export const Route = createFileRoute('/iniciar-sesion')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string; paso?: 'totp' } => ({
    redirect: parseRedirect(search.redirect),
    paso: search.paso === 'totp' ? 'totp' : undefined,
  }),
  beforeLoad: ({ context, search }) => redirectIfSignedIn(context.queryClient, search.redirect),
  component: LoginPage,
});
