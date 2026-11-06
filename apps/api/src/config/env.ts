import { z } from 'zod';

const flag = z.enum(['true', 'false']).transform((value) => value === 'true');
// En .env una variable opcional puede quedar vacía ("GOOGLE_CLIENT_ID="): vacía equivale a ausente.
const optional = z
  .string()
  .optional()
  .transform((value) => value || undefined);

/** Variables de entorno de la API (ver .env.example). Si una falta o es inválida, la API no arranca. */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  API_PORT: z.coerce.number().int().min(1).max(65_535),
  WEB_ORIGIN: z.url(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),

  DATABASE_URL: z.url(),
  VALKEY_URL: z.url(),

  S3_ENDPOINT: z.url(),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_FORCE_PATH_STYLE: flag,

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65_535),
  SMTP_SECURE: flag,
  SMTP_USER: optional,
  SMTP_PASSWORD: optional,
  MAIL_FROM: z.string().min(3),

  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: optional,
  GOOGLE_CLIENT_SECRET: optional,

  // Sesión de prueba para E2E (ver README): solo existe con NODE_ENV=test y ENABLE_TEST_AUTH=1.
  ENABLE_TEST_AUTH: z.enum(['0', '1']).default('0'),
}).refine((env) => env.NODE_ENV !== 'production' || env.ENABLE_TEST_AUTH === '0', {
  path: ['ENABLE_TEST_AUTH'],
  error: 'must be 0 in production',
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    // Solo nombres de variables y reglas: los valores (secretos) nunca llegan al log.
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
