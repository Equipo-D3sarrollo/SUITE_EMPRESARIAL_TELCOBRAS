import { passkeyClient } from '@better-auth/passkey/client';
import { createAuthClient } from 'better-auth/client';
import { magicLinkClient, twoFactorClient } from 'better-auth/client/plugins';

/**
 * Cliente de Better Auth (ADR-006): Google o correo + passkey, con TOTP. Sin contraseñas.
 * El enlace por correo solo se usa para verificar el correo al registrarse. La sesión va en cookie httpOnly.
 */
export const authClient = createAuthClient({
  plugins: [
    passkeyClient(),
    magicLinkClient(),
    // Recarga la página de login en el paso TOTP: así funciona igual tras un redirect de Google.
    twoFactorClient({ twoFactorPage: '/iniciar-sesion?paso=totp' }),
  ],
});

export type AuthSession = typeof authClient.$Infer.Session;

/** Google aparece solo si el despliegue lo configuró (GOOGLE_CLIENT_ID en la API y VITE_AUTH_GOOGLE_ENABLED aquí). */
export const googleEnabled = import.meta.env.VITE_AUTH_GOOGLE_ENABLED === 'true';
