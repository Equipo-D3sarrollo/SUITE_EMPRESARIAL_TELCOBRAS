import { boolean, index, integer, text, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, nullableTimestamp, updatedAt } from './columns.js';

// Tablas de Better Auth (ADR-006). Son globales: una persona existe una sola vez y entra a varias
// organizaciones por memberships, así que no llevan organization_id ni RLS.
// Las sesiones y los valores de verificación viven en Valkey (secondaryStorage), no aquí.
// La columna account.password es requerida por el esquema de Better Auth, pero no se configura ni se llena:
// el acceso es solo con passkey o Google.

export const users = appSchema.table('users', {
  id: id(),
  name: text('name').notNull(),
  email: text('email').notNull().unique('users_email_key'),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/** Cuentas de proveedores externos (Google). Los tokens de Google nunca salen de la API. */
export const accounts = appSchema.table(
  'accounts',
  {
    id: id(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: nullableTimestamp('access_token_expires_at'),
    refreshTokenExpiresAt: nullableTimestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('accounts_user_id_idx').on(t.userId)],
);

export const passkeys = appSchema.table(
  'passkeys',
  {
    id: id(),
    name: text('name'),
    publicKey: text('public_key').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    credentialID: text('credential_id').notNull().unique('passkeys_credential_id_key'),
    counter: integer('counter').notNull(),
    deviceType: text('device_type').notNull(),
    backedUp: boolean('backed_up').notNull(),
    transports: text('transports'),
    aaguid: text('aaguid'),
    createdAt: createdAt(),
  },
  (t) => [index('passkeys_user_id_idx').on(t.userId)],
);

/** Secreto TOTP y códigos de respaldo (Better Auth los guarda cifrados). */
export const twoFactors = appSchema.table(
  'two_factors',
  {
    id: id(),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    verified: boolean('verified').default(true),
    failedVerificationCount: integer('failed_verification_count').default(0),
    lockedUntil: nullableTimestamp('locked_until'),
  },
  (t) => [index('two_factors_user_id_idx').on(t.userId)],
);
