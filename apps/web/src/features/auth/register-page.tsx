import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';
import { Button, Field, Input } from '@telcobras/ui';
import { KeyRound, MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { t } from '@/i18n/es-CO';
import { authClient } from '@/lib/auth-client';
import { AuthLayout } from './auth-layout';
import { FormError } from './form-error';
import { GoogleSignIn } from './google-sign-in';
import { useEnterApp } from './use-enter-app';

/** /registro: Google, o correo → enlace de verificación → passkey. Sin contraseña (ADR-006). */
export function RegisterPage() {
  const { redirect, paso } = useSearch({ from: '/registro' });
  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <ol className="flex gap-4 text-xs">
          <li aria-current={paso ? undefined : 'step'} className="aria-[current]:font-semibold">
            {t.auth.register.steps.verify}
          </li>
          <li aria-current={paso ? 'step' : undefined} className="aria-[current]:font-semibold">
            {t.auth.register.steps.passkey}
          </li>
        </ol>
        {paso === 'passkey' ? (
          <PasskeyStep redirect={redirect} />
        ) : (
          <EmailStep redirect={redirect} />
        )}
      </div>
    </AuthLayout>
  );
}

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
});

function EmailStep({ redirect }: { redirect: string | undefined }) {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '' },
  });
  const { errors } = form.formState;
  const verifyEmail = useMutation({
    mutationFn: async ({ name, email }: z.infer<typeof registerSchema>) => {
      // El enlace del correo abre la sesión y vuelve aquí, al paso de la passkey.
      const callbackURL = `/registro?${new URLSearchParams({ paso: 'passkey', ...(redirect && { redirect }) })}`;
      const { error } = await authClient.signIn.magicLink({
        name,
        email,
        callbackURL,
        newUserCallbackURL: callbackURL,
      });
      if (error) throw error;
      return email;
    },
  });

  if (verifyEmail.isSuccess) {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <MailCheck aria-hidden="true" className="size-10 text-tb-azul" />
        <h1 className="font-semibold text-2xl">{t.auth.register.checkEmailTitle}</h1>
        <p className="text-sm">{t.auth.register.checkEmailDescription(verifyEmail.data)}</p>
        <Button variant="secondary" onClick={() => verifyEmail.reset()}>
          {t.auth.register.useAnotherEmail}
        </Button>
      </div>
    );
  }

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">{t.auth.register.title}</h1>
        <p className="text-sm">{t.auth.register.description}</p>
      </header>
      <GoogleSignIn label={t.auth.register.google} callbackURL={redirect ?? '/onboarding'} />
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) => verifyEmail.mutate(values))}
      >
        <Field label={t.auth.register.nameLabel} error={errors.name && t.auth.register.invalidName}>
          <Input autoComplete="name" {...form.register('name')} />
        </Field>
        <Field label={t.auth.emailLabel} error={errors.email && t.auth.invalidEmail}>
          <Input
            type="email"
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            {...form.register('email')}
          />
        </Field>
        {verifyEmail.isError && <FormError>{t.auth.register.error}</FormError>}
        <Button type="submit" disabled={verifyEmail.isPending}>
          {t.auth.register.submit}
        </Button>
      </form>
      <p className="text-sm">
        {t.auth.register.haveAccount}{' '}
        <Link
          to="/iniciar-sesion"
          search={{ redirect }}
          className="font-medium underline underline-offset-2"
        >
          {t.auth.register.signIn}
        </Link>
      </p>
    </>
  );
}

function PasskeyStep({ redirect }: { redirect: string | undefined }) {
  const enterApp = useEnterApp();
  const createPasskey = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.passkey.addPasskey();
      if (error) throw error;
    },
    onSuccess: () => enterApp(redirect ?? '/onboarding'),
  });

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">{t.auth.register.passkeyTitle}</h1>
        <p className="text-sm">{t.auth.register.passkeyDescription}</p>
      </header>
      {createPasskey.isError && <FormError>{t.auth.register.passkeyError}</FormError>}
      <Button disabled={createPasskey.isPending} onClick={() => createPasskey.mutate()}>
        <KeyRound aria-hidden="true" />
        {t.auth.register.passkeySubmit}
      </Button>
    </>
  );
}
