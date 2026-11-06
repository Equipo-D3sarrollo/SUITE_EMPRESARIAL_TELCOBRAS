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
import { useEnterApp } from './use-enter-app';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
});

type RegisterValues = z.infer<typeof registerSchema>;

/**
 * /registro: Google, o nombre + correo → código de 6 dígitos por correo. Al verificar el código, la API crea
 * la cuenta (con el correo ya verificado) y abre la sesión. Sin contraseña (ADR-006).
 */
export function RegisterPage() {
  const { redirect } = useSearch({ from: '/registro' });
  const enterApp = useEnterApp();
  const [values, setValues] = useState<RegisterValues>({ name: '', email: '' });
  const [codeSent, setCodeSent] = useState(false);

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <ol className="flex gap-4 text-xs">
          <li aria-current={codeSent ? undefined : 'step'} className="aria-[current]:font-semibold">
            {t.auth.register.steps.details}
          </li>
          <li aria-current={codeSent ? 'step' : undefined} className="aria-[current]:font-semibold">
            {t.auth.register.steps.code}
          </li>
        </ol>
        {codeSent ? (
          <OtpStep
            email={values.email}
            name={values.name}
            submitLabel={t.auth.register.submitCode}
            onSignedIn={() => enterApp(redirect ?? '/onboarding')}
            onChangeEmail={() => setCodeSent(false)}
          />
        ) : (
          <DetailsStep
            redirect={redirect}
            defaultValues={values}
            onCodeSent={(sent) => {
              setValues(sent);
              setCodeSent(true);
            }}
          />
        )}
      </div>
    </AuthLayout>
  );
}

type DetailsStepProps = {
  redirect: string | undefined;
  defaultValues: RegisterValues;
  onCodeSent: (values: RegisterValues) => void;
};

function DetailsStep({ redirect, defaultValues, onCodeSent }: DetailsStepProps) {
  const form = useForm({ resolver: zodResolver(registerSchema), defaultValues });
  const { errors } = form.formState;
  const sendCode = useMutation({
    mutationFn: async (values: RegisterValues) => {
      await sendSignInCode(values.email);
      return values;
    },
    onSuccess: onCodeSent,
  });

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
        onSubmit={form.handleSubmit((values) => sendCode.mutate(values))}
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
        {sendCode.isError && <FormError>{sendCodeErrorMessage(sendCode.error)}</FormError>}
        <Button type="submit" disabled={sendCode.isPending}>
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
