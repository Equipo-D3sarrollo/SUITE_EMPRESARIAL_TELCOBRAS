import { useMutation } from '@tanstack/react-query';
import { Button, Field, Input } from '@telcobras/ui';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { authClient } from '@/lib/auth-client';
import { FormError } from './form-error';

/** Segundo factor: código TOTP de 6 dígitos de la aplicación de autenticación. */
export function TotpStep({ onVerified }: { onVerified: () => Promise<void> }) {
  const [code, setCode] = useState('');
  const [invalid, setInvalid] = useState(false);
  const verify = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.twoFactor.verifyTotp({ code });
      if (error) throw error;
    },
    onSuccess: onVerified,
  });

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        const valid = /^\d{6}$/.test(code);
        setInvalid(!valid);
        if (valid) verify.mutate();
      }}
    >
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">{t.auth.totp.title}</h1>
        <p className="text-sm">{t.auth.totp.description}</p>
      </header>
      <Field label={t.auth.totp.label} error={invalid ? t.auth.totp.invalid : undefined}>
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value.trim())}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className="tabular-nums tracking-widest"
        />
      </Field>
      {verify.isError && <FormError>{t.auth.totp.error}</FormError>}
      <Button type="submit" disabled={verify.isPending}>
        {t.auth.totp.submit}
      </Button>
    </form>
  );
}
