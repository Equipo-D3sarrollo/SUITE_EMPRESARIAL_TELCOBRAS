/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" cuando la API tiene configurado Google Workspace (GOOGLE_CLIENT_ID). */
  readonly VITE_AUTH_GOOGLE_ENABLED?: string;
}
