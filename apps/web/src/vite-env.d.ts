/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" cuando la API tiene configurado Google Workspace (GOOGLE_CLIENT_ID). */
  readonly VITE_AUTH_GOOGLE_ENABLED?: string;
  /** "1" activa los mocks MSW de DataDian en `vite dev` (nunca en el build de producción). */
  readonly VITE_DATADIAN_MOCKS?: string;
  /** Perfil de la sesión simulada con mocks: owner (por defecto), accountant o viewer. */
  readonly VITE_DATADIAN_MOCK_PROFILE?: string;
}
