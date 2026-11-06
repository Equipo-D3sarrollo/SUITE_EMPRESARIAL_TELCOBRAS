import { useMutation } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';
import { Button, Field, Input } from '@telcobras/ui';
import { KeyRound } from 'lucide-react';
import { useEffect } from 'react';
import { t } from '@/i18n/es-CO';
import { authClient } from '@/lib/auth-client';
import { AuthLayout } from './auth-layout';
import { FormError } from './form-error';
import { GoogleSignIn } from './google-sign-in';
import { TotpStep } from './totp-step';
import { useEnterApp } from './use-enter-app';

/** /iniciar-sesion: Google Workspace o passkey; TOTP si la cuenta lo tiene activo. Sin contraseña (ADR-006). */
export function LoginPage() {
  const { redirect, paso } = useSearch({ from: '/iniciar-sesion' });
  const target = redirect ?? '/app';
  const enterApp = useEnterApp();

  const passkey = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signIn.passkey();
      if (error) throw error;
    },
    onSuccess: () => enterApp(target),
  });

  // Autocompletado de passkeys en el campo de correo (WebAuthn conditional UI), donde el navegador lo soporte.
  useEffect(() => {
    if (paso === 'totp') return;
    void (async () => {
      if (!(await window.PublicKeyCredential?.isConditionalMediationAvailable?.())) return;
      const { error } = await authClient.signIn.passkey({ autoFill: true });
      if (!error) await enterApp(target);
    })();
  }, []);

  return (
    <AuthLayout>
      {paso === 'totp' ? (
        <TotpStep onVerified={() => enterApp(target)} />
      ) : (
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="font-semibold text-2xl">{t.auth.login.title}</h1>
            <p className="text-sm">{t.auth.login.description}</p>
          </header>
          <GoogleSignIn label={t.auth.login.google} callbackURL={target} />
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              passkey.mutate();
            }}
          >
            <Field label={t.auth.emailLabel} description={t.auth.login.passkeyHint}>
              <Input
                type="email"
                name="email"
                autoComplete="username webauthn"
                placeholder={t.auth.emailPlaceholder}
              />
            </Field>
            {passkey.isError && <FormError>{t.auth.login.error}</FormError>}
            <Button type="submit" disabled={passkey.isPending}>
              <KeyRound aria-hidden="true" />
              {t.auth.login.passkey}
            </Button>
          </form>
          <p className="text-sm">
            {t.auth.login.noAccount}{' '}
            <Link
              to="/registro"
              search={{ redirect }}
              className="font-medium underline underline-offset-2"
            >
              {t.auth.login.createAccount}
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
