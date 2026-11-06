import { useMutation } from '@tanstack/react-query';
import { Button } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';
import { authClient, googleEnabled } from '@/lib/auth-client';
import { OrDivider } from './auth-layout';
import { FormError } from './form-error';

type GoogleSignInProps = { label: string; callbackURL: string };

/** Acceso con Google Workspace (OIDC). No se muestra si el despliegue no lo configuró. */
export function GoogleSignIn({ label, callbackURL }: GoogleSignInProps) {
  const google = useMutation({
    // Better Auth redirige el navegador a Google; al volver, la sesión ya está en la cookie.
    mutationFn: async () => {
      const { error } = await authClient.signIn.social({ provider: 'google', callbackURL });
      if (error) throw error;
    },
  });

  if (!googleEnabled) return null;

  return (
    <>
      <Button variant="secondary" disabled={google.isPending} onClick={() => google.mutate()}>
        {label}
      </Button>
      {google.isError && <FormError>{t.auth.login.error}</FormError>}
      <OrDivider />
    </>
  );
}
