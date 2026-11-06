import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useSearch } from '@tanstack/react-router';
import { Button, Field, Input } from '@telcobras/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { t } from '@/i18n/es-CO';
import { AuthLayout } from './auth-layout';
import { FormError } from './form-error';
import { GoogleSignIn } from './google-sign-in';
import { emailSchema, OtpStep, sendCodeErrorMessage, sendSignInCode } from './otp-step';
import { TotpStep } from './totp-step';
import { useEnterApp } from './use-enter-app';

/**
 * /iniciar-sesion: Google Workspace, o correo → código de 6 dígitos por correo; TOTP si la cuenta lo tiene
 * activo. Sin contraseña (ADR-006, ADR-012). Un correo sin cuenta no se registra aquí: la API lo rechaza
 * (ACCOUNT_NOT_FOUND) y se ofrece ir a /registro, que es donde se pide el nombre.
 */
export function LoginPage() {
  const { redirect, paso } = useSearch({ from: '/iniciar-sesion' });
  const target = redirect ?? '/app';
  const enterApp = useEnterApp();
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  return (
    <AuthLayout>
      {paso === 'totp' ? (
        <TotpStep onVerified={() => enterApp(target)} />
      ) : codeSent ? (
        <OtpStep
          email={email}
          submitLabel={t.auth.login.submitCode}
          onSignedIn={() => enterApp(target)}
          onChangeEmail={() => setCodeSent(false)}
          noAccountAction={<CreateAccountLink redirect={redirect} />}
        />
      ) : (
        <EmailStep
          redirect={redirect}
          target={target}
          defaultEmail={email}
          onCodeSent={(sentTo) => {
            setEmail(sentTo);
            setCodeSent(true);
          }}
        />
      )}
    </AuthLayout>
  );
}

const loginSchema = z.object({ email: emailSchema });

type EmailStepProps = {
  redirect: string | undefined;
  target: string;
  defaultEmail: string;
  onCodeSent: (email: string) => void;
};

function EmailStep({ redirect, target, defaultEmail, onCodeSent }: EmailStepProps) {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail },
  });
  const { errors } = form.formState;
  const sendCode = useMutation({
    mutationFn: async ({ email }: z.infer<typeof loginSchema>) => {
      await sendSignInCode(email);
      return email;
    },
    onSuccess: onCodeSent,
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">{t.auth.login.title}</h1>
        <p className="text-sm">{t.auth.login.description}</p>
      </header>
      <GoogleSignIn label={t.auth.login.google} callbackURL={target} />
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((values) => sendCode.mutate(values))}
      >
        <Field label={t.auth.emailLabel} error={errors.email && t.auth.invalidEmail}>
          <Input
            type="email"
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            {...form.register('email')}
          />
        </Field>
        {sendCode.isError && <FormError>{sendCodeErrorMessage(sendCode.error)}</FormError>}
        <Button type="submit" disabled={sendCode.isPending}>
          {t.auth.login.sendCode}
        </Button>
      </form>
      <CreateAccountLink redirect={redirect} />
    </div>
  );
}

/** Enlace a /registro que conserva el destino (?redirect), por ejemplo el de una invitación. */
function CreateAccountLink({ redirect }: { redirect: string | undefined }) {
  return (
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
  );
}
