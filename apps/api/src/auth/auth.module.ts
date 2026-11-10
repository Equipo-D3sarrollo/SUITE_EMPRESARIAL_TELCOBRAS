import { Global, Module } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import { emailOTP, twoFactor } from 'better-auth/plugins';
import { Redis } from 'ioredis';
import { createTransport } from 'nodemailer';
import { ENV } from '../config/config.module.js';
import type { Env } from '../config/env.js';
import type { Database } from '../database/database.js';
import { DB } from '../database/db.module.js';
import { accounts, twoFactors, users } from '../database/schema/index.js';

export const AUTH = Symbol('AUTH');
export const MAILER = Symbol('MAILER');
export type AuthInstance = ReturnType<typeof betterAuth>;
export interface Mailer {
  sendMail(options: { from: string; to: string; subject: string; text: string }): Promise<unknown>;
}

/** Vigencia del código de acceso, en segundos. El texto del correo la repite en minutos. */
const OTP_EXPIRES_IN_SECONDS = 600;

/** Código de error cuando se pide entrar con un correo sin cuenta (el nombre solo se pide en /registro). */
export const ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND';

/**
 * Better Auth 1.7.17 solo exige el segundo factor (TOTP) después de /sign-in/email, /sign-in/username y
 * /sign-in/phone-number (`signInPaths` en better-auth/dist/plugins/two-factor/index.mjs). Sin este ajuste,
 * quien activó TOTP entraría solo con el código del correo. Se reutiliza el mismo hook del plugin, que
 * borra la sesión recién creada y responde `twoFactorRedirect`, ampliando su matcher a /sign-in/email-otp.
 *
 * Cubre solo el código por correo. El acceso con Google (/callback/google, /sign-in/social) todavía NO
 * pide TOTP: el hook responde JSON y el callback de OAuth es una navegación, así que hace falta otro
 * manejo (ver ADR-012 y docs/PENDIENTES.md).
 */
function requireTwoFactorOnEmailOtp<T extends ReturnType<typeof twoFactor>>(plugin: T): T {
  return {
    ...plugin,
    hooks: {
      ...plugin.hooks,
      after: plugin.hooks.after.map((hook) => ({
        ...hook,
        matcher: (context: Parameters<typeof hook.matcher>[0]) =>
          hook.matcher(context) || context.path === '/sign-in/email-otp',
      })),
    },
  };
}

function createAuth(db: Database, env: Env, valkey: Redis, mailer: Mailer) {
  return betterAuth({
    appName: 'OrveX.IA',
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.WEB_ORIGIN],
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: { user: users, account: accounts, twoFactor: twoFactors },
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
    databaseHooks: {
      user: {
        create: {
          // /sign-in/email-otp crea la cuenta si el correo no existe, con `name || ''`. Solo /registro manda el
          // nombre: si el código se pidió desde /iniciar-sesion con un correo sin cuenta, se rechaza en vez de
          // crear una cuenta sin nombre. Corre después de verificar el código, así que no revela qué correos
          // tienen cuenta a quien no controla el buzón.
          before: async (user, context) => {
            if (context?.path === '/sign-in/email-otp' && !user.name?.trim()) {
              throw new APIError('BAD_REQUEST', {
                code: ACCOUNT_NOT_FOUND,
                message: 'No hay una cuenta con este correo.',
              });
            }
          },
        },
      },
    },
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: OTP_EXPIRES_IN_SECONDS,
        allowedAttempts: 5,
        // Cifrado con la clave derivada de BETTER_AUTH_SECRET. Un hash SHA-256 sin clave de 6 dígitos se
        // invierte probando el millón de combinaciones, así que no protegería el código guardado en Valkey.
        storeOTP: 'encrypted',
        disableSignUp: false,
        sendVerificationOTP: async ({ email, otp, type }) => {
          // Solo se usa el código para entrar o registrarse: no hay contraseñas ni cambio de correo.
          if (type !== 'sign-in') return;
          await mailer.sendMail({
            from: env.MAIL_FROM,
            to: email,
            subject: 'Tu código de acceso a OrveX.IA',
            text: [
              `Tu código de acceso es: ${otp}`,
              '',
              `Vence en ${OTP_EXPIRES_IN_SECONDS / 60} minutos y solo sirve una vez.`,
              'Si no intentaste entrar a OrveX.IA, ignora este correo.',
            ].join('\n'),
          });
        },
      }),
      requireTwoFactorOnEmailOtp(twoFactor({ issuer: 'OrveX.IA' })),
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
