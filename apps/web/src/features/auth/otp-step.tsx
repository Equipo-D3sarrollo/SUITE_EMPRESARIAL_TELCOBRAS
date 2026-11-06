import { useMutation } from '@tanstack/react-query';
import { Button, Field, Input } from '@telcobras/ui';
import { MailCheck } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { t } from '@/i18n/es-CO';
import { authClient } from '@/lib/auth-client';
import { FormError } from './form-error';

/** Error de Better Auth tal como lo devuelve el cliente (`{ error }`). */
type AuthError = { code?: string; status?: number };

/** Correo del primer paso (login y registro), normalizado como lo guarda la API. */
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email().max(254));

/**
 * Pide el código de acceso por correo. El tipo 'sign-in' sirve para entrar y para crear la cuenta:
 * si el correo no existe, la API crea el usuario al verificar el código.
 */
export async function sendSignInCode(email: string) {
  const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' });
  if (error) throw error;
}

/** Mensaje para un fallo al enviar el código. */
export function sendCodeErrorMessage(error: unknown): string {
  return (error as AuthError | null)?.status === 429
    ? t.auth.code.errors.rateLimited
    : t.auth.code.errors.send;
}

/** La API rechaza crear una cuenta sin nombre: el código se pidió desde el login con un correo sin cuenta. */
const ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND';

/**
 * Errores tras los que el código ya no sirve: la API lo borró (vencido, demasiados intentos) o lo consumió
 * (cuenta inexistente). Desde ahí cualquier intento responde INVALID_OTP, así que solo queda pedir otro.
 */
const SPENT_CODE_ERRORS = new Set(['OTP_EXPIRED', 'TOO_MANY_ATTEMPTS', ACCOUNT_NOT_FOUND]);

function errorCode(error: unknown): string | undefined {
  return ((error ?? {}) as AuthError).code;
}

function verifyErrorMessage(error: unknown): string {
  const { code, status } = (error ?? {}) as AuthError;
  if (code === 'INVALID_OTP') return t.auth.code.errors.invalid;
  if (code === 'OTP_EXPIRED') return t.auth.code.errors.expired;
  if (code === 'TOO_MANY_ATTEMPTS') return t.auth.code.errors.tooManyAttempts;
  if (code === ACCOUNT_NOT_FOUND) return t.auth.code.errors.accountNotFound;
  if (status === 429) return t.auth.code.errors.rateLimited;
  return t.auth.code.errors.verify;
}

type OtpStepProps = {
  email: string;
  /** Solo en el registro: nombre con el que la API crea el usuario si el correo es nuevo. */
  name?: string;
  submitLabel: string;
  /** Sesión abierta sin segundo factor pendiente. */
  onSignedIn: () => Promise<void>;
  onChangeEmail: () => void;
  /** Solo en el login: acción para crear la cuenta cuando el correo no tiene una. */
  noAccountAction?: ReactNode;
};

/**
 * Segundo paso del acceso por correo: el código de 6 dígitos que llegó al correo (vence en 10 minutos).
 * Si la cuenta tiene TOTP, el cliente de Better Auth lleva al paso TOTP de /iniciar-sesion.
 */
export function OtpStep({
  email,
  name,
  submitLabel,
  onSignedIn,
  onChangeEmail,
  noAccountAction,
}: OtpStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState('');
  const [invalidFormat, setInvalidFormat] = useState(false);
  const [resent, setResent] = useState(false);
  /** Error que dejó inutilizado el código; se mantiene hasta pedir uno nuevo. */
  const [spentCodeError, setSpentCodeError] = useState<unknown>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const verify = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp: code,
        ...(name && { name }),
      });
      if (error) throw error;
      // Con TOTP activo no hay sesión todavía: el plugin twoFactorClient ya está navegando al paso TOTP.
      return { twoFactorRedirect: Boolean(data && 'twoFactorRedirect' in data) };
    },
    onSuccess: ({ twoFactorRedirect }) => (twoFactorRedirect ? undefined : onSignedIn()),
    onError: (error) => {
      const code = errorCode(error);
      if (code && SPENT_CODE_ERRORS.has(code)) setSpentCodeError(error);
      else inputRef.current?.select();
    },
  });

  const resend = useMutation({
    mutationFn: () => sendSignInCode(email),
    onSuccess: () => {
      verify.reset();
      setCode('');
      setInvalidFormat(false);
      setSpentCodeError(null);
      setResent(true);
      inputRef.current?.focus();
    },
  });

  const codeSpent = spentCodeError !== null;
  const error = codeSpent
    ? verifyErrorMessage(spentCodeError)
    : invalidFormat
      ? t.auth.code.invalidFormat
      : verify.isError
        ? verifyErrorMessage(verify.error)
        : undefined;
  const accountNotFound = errorCode(spentCodeError) === ACCOUNT_NOT_FOUND;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-start gap-2">
        <MailCheck aria-hidden="true" className="size-10 text-tb-azul" />
        <h1 className="font-semibold text-2xl">{t.auth.code.title}</h1>
        <p role="status" className="text-sm">
          {resent ? t.auth.code.resent(email) : t.auth.code.sent(email)}
        </p>
      </header>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const valid = /^\d{6}$/.test(code);
          setInvalidFormat(!valid);
          if (valid) verify.mutate();
        }}
      >
        <Field
          label={t.auth.code.label}
          description={t.auth.code.hint}
          error={error && <span role="alert">{error}</span>}
        >
          <Input
            ref={inputRef}
            name="otp"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            className="tabular-nums tracking-widest"
          />
        </Field>
        <Button type="submit" disabled={codeSpent || verify.isPending || verify.isSuccess}>
          {submitLabel}
        </Button>
      </form>
      {accountNotFound && noAccountAction}
      {resend.isError && <FormError>{sendCodeErrorMessage(resend.error)}</FormError>}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" disabled={resend.isPending} onClick={() => resend.mutate()}>
          {t.auth.code.resend}
        </Button>
        <Button variant="ghost" onClick={onChangeEmail}>
          {t.auth.code.useAnotherEmail}
        </Button>
      </div>
    </div>
  );
}
