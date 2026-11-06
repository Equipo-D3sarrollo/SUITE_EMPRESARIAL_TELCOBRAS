import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import { Button, Skeleton } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';
import { api, unwrap } from '@/lib/api-client';
import { sessionQuery } from '@/lib/queries';
import { AuthLayout } from './auth-layout';
import { FormError } from './form-error';
import { useEnterApp } from './use-enter-app';

/** /invitacion/$token: con sesión acepta la invitación; sin sesión manda a registro o login y vuelve aquí. */
export function InvitationPage() {
  const { token } = useParams({ from: '/invitacion/$token' });
  const { href } = useLocation();
  const session = useQuery(sessionQuery);
  const enterApp = useEnterApp();

  const accept = useMutation({
    mutationFn: async () => {
      const { organizationId } = await unwrap(
        api.POST('/api/v1/invitations/{token}/accept', { params: { path: { token } } }),
      );
      await unwrap(api.POST('/api/v1/me/active-organization', { body: { organizationId } }));
    },
    onSuccess: () => enterApp('/app'),
  });

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-semibold text-2xl">{t.auth.invitation.title}</h1>
          <p className="text-sm">{t.auth.invitation.description}</p>
        </header>
        {session.isPending ? (
          <div aria-busy="true">
            <span className="sr-only">{t.common.loading}</span>
            <Skeleton className="h-9.5" />
          </div>
        ) : session.data ? (
          <>
            {accept.isError && <FormError>{t.auth.invitation.error}</FormError>}
            <Button disabled={accept.isPending} onClick={() => accept.mutate()}>
              {t.auth.invitation.accept}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm">{t.auth.invitation.signedOutHint}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/registro" search={{ redirect: href }}>
                  {t.auth.login.createAccount}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/iniciar-sesion" search={{ redirect: href }}>
                  {t.auth.register.signIn}
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
