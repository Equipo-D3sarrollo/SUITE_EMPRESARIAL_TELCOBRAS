import { passkey } from '@better-auth/passkey';
import { Global, Module } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink, twoFactor } from 'better-auth/plugins';
import { Redis } from 'ioredis';
import { createTransport } from 'nodemailer';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';
import type { Database } from '../database/database.js';
import { DB } from '../database/db.module.js';
import { accounts, passkeys, twoFactors, users } from '../database/schema/index.js';

export const AUTH = Symbol('AUTH');
export const MAILER = Symbol('MAILER');
export type AuthInstance = ReturnType<typeof betterAuth>;
export interface Mailer {
  sendMail(options: { from: string; to: string; subject: string; text: string }): Promise<unknown>;
}

function createAuth(db: Database, env: Env, valkey: Redis, mailer: Mailer) {
  const authUrl = new URL(env.BETTER_AUTH_URL);

  return betterAuth({
    appName: 'Suite Empresarial Telcobras',
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.WEB_ORIGIN],
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: { user: users, account: accounts, passkey: passkeys, twoFactor: twoFactors },
    }),
    advanced: { database: { generateId: 'uuid' } },
    emailAndPassword: { enabled: false },
    secondaryStorage: {
      get: (key) => valkey.get(key),
      getAndDelete: (key) => valkey.getdel(key),
      increment: async (key, ttl) => {
        const result = await valkey.eval(
          "local value = redis.call('INCR', KEYS[1]); if value == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; return value",
          1,
          key,
          ttl,
        );
        return Number(result);
      },
      set: async (key, value, ttl) => {
        if (ttl === undefined) await valkey.set(key, value);
        else await valkey.set(key, value, 'EX', ttl);
      },
      delete: async (key) => {
        await valkey.del(key);
      },
    },
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {},
    plugins: [
      magicLink({
        storeToken: 'hashed',
        sendMagicLink: async ({ email, url }) => {
          await mailer.sendMail({
            from: env.MAIL_FROM,
            to: email,
            subject: 'Verifica tu correo para Suite Telcobras',
            text: `Abre este enlace para continuar: ${url}`,
          });
        },
      }),
      passkey({
        rpID: authUrl.hostname,
        origin: env.BETTER_AUTH_URL,
        rpName: 'Telcobras',
      }),
      twoFactor({ issuer: 'Telcobras' }),
    ],
  });
}

@Global()
@Module({
  providers: [
    {
      provide: MAILER,
      inject: [ENV],
      useFactory: (env: Env) =>
        createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_SECURE,
          auth:
            env.SMTP_USER && env.SMTP_PASSWORD
              ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
              : undefined,
        }),
    },
    {
      provide: AUTH,
      inject: [DB, ENV, Redis, MAILER],
      useFactory: (db: Database, env: Env, valkey: Redis, mailer: Mailer) =>
        createAuth(db, env, valkey, mailer),
    },
  ],
  exports: [AUTH, MAILER],
})
export class AuthModule {}
