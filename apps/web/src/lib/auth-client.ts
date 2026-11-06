import { createAuthClient } from 'better-auth/client';
import { emailOTPClient, twoFactorClient } from 'better-auth/client/plugins';

/**
 * Cliente de Better Auth (ADR-006, ADR-012): Google o correo + código de un solo uso (OTP) enviado por
 * correo, con TOTP opcional como segundo factor. Sin contraseñas, sin passkeys ni enlace mágico. La sesión
 * va en cookie httpOnly.
 */
export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    twoFactorClient({
      // Si la cuenta tiene TOTP, el login con código no abre sesión: se recarga /iniciar-sesion en el paso TOTP
      // conservando el destino (?redirect), que la ruta vuelve a validar.
      onTwoFactorRedirect: () => {
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.assign(
          `/iniciar-sesion?${new URLSearchParams({ paso: 'totp', ...(redirect && { redirect }) })}`,
        );
      },
    }),
  ],
});

export type AuthSession = typeof authClient.$Infer.Session;

/** Google aparece solo si el despliegue lo configuró (GOOGLE_CLIENT_ID en la API y VITE_AUTH_GOOGLE_ENABLED aquí). */
export const googleEnabled = import.meta.env.VITE_AUTH_GOOGLE_ENABLED === 'true';
