// Acceso con código de un solo uso enviado al correo (Better Auth, plugin emailOTP), contra la API real.
import { createHash, randomUUID } from 'node:crypto';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { eq, inArray } from 'drizzle-orm';
import { Redis } from 'ioredis';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { ACCOUNT_NOT_FOUND, MAILER, type Mailer } from '../src/auth/auth.module.js';
import { twoFactors, users } from '../src/database/schema/index.js';
import { ownerDatabase } from './support/database.js';

type SentMessage = Parameters<Mailer['sendMail']>[0];

const ownerDb = ownerDatabase();
const sentMessages: SentMessage[] = [];
const emails: string[] = [];
let app: NestFastifyApplication;

beforeAll(async () => {
  app = await createApp();
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  // Better Auth llama a mailer.sendMail en cada envío: se intercepta en lugar de mandar el correo por SMTP.
  vi.spyOn(app.get<Mailer>(MAILER), 'sendMail').mockImplementation(async (message) => {
    sentMessages.push(message);
  });
}, 30_000);

afterAll(async () => {
  if (emails.length > 0) await ownerDb.delete(users).where(inArray(users.email, emails));
  await Promise.all([app.close(), ownerDb.$client.end()]);
});

describe('acceso con código al correo', () => {
  it('envía un código de 6 dígitos por correo, sin el código en el asunto', async () => {
    const email = newEmail();

    const response = await sendCode(email);

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ success: true });
    const message = lastMessageTo(email);
    expect(message.from).toBe(process.env.MAIL_FROM);
    expect(message.text).toMatch(/\b\d{6}\b/);
    expect(message.text).toContain('10 minutos');
    expect(message.subject).not.toMatch(/\d/);
    expect(message.subject).not.toContain(codeFrom(message));
  });

  it('con el código correcto crea la cuenta verificada y abre la sesión', async () => {
    const email = newEmail();
    await sendCode(email);
    const otp = codeFrom(lastMessageTo(email));

    const response = await post('/api/auth/sign-in/email-otp', {
      email,
      otp,
      name: 'Persona con código',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ user: { email, emailVerified: true } });
    const [user] = await ownerDb
      .select({ name: users.name, emailVerified: users.emailVerified })
      .from(users)
      .where(eq(users.email, email));
    expect(user).toEqual({ name: 'Persona con código', emailVerified: true });

    const session = await app.inject({
      method: 'GET',
      url: '/api/auth/get-session',
      headers: { cookie: cookieHeader(response.headers['set-cookie']) },
    });
    expect(session.json()).toMatchObject({ user: { email } });

    // El código es de un solo uso.
    const reused = await post('/api/auth/sign-in/email-otp', { email, otp });
    expect(reused.statusCode).toBe(400);
  });

  it('rechaza un código incorrecto sin crear la cuenta', async () => {
    const email = newEmail();
    await sendCode(email);
    const otp = codeFrom(lastMessageTo(email));
    const wrongOtp = String((Number(otp) + 1) % 1_000_000).padStart(6, '0');

    const response = await post('/api/auth/sign-in/email-otp', { email, otp: wrongOtp });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code: 'INVALID_OTP' });
    expect(response.headers['set-cookie'] ?? []).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/session_token=[^;]+/)]),
    );
    const created = await ownerDb
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));
    expect(created).toEqual([]);
  });

  it('guarda el código cifrado en Valkey, ni en claro ni con un hash sin clave', async () => {
    const email = newEmail();
    await sendCode(email);
    const otp = codeFrom(lastMessageTo(email));

    const stored = await app.get(Redis).get(`verification:sign-in-otp-${email}`);

    expect(stored).not.toBeNull();
    const { value } = JSON.parse(stored ?? '{}') as { value: string };
    const unkeyedHash = createHash('sha256').update(otp).digest('base64url');
    expect(value).not.toContain(otp);
    expect(value).not.toContain(unkeyedHash);
  });

  it('desde el login no crea una cuenta sin nombre para un correo nuevo', async () => {
    const email = newEmail();
    await sendCode(email);

    const response = await post('/api/auth/sign-in/email-otp', {
      email,
      otp: codeFrom(lastMessageTo(email)),
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code: ACCOUNT_NOT_FOUND });
    expect(response.headers['set-cookie'] ?? []).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/session_token=[^;]+/)]),
    );
    const created = await ownerDb
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));
    expect(created).toEqual([]);
  });

  it('con una cuenta existente entra sin pedir el nombre', async () => {
    const email = newEmail();
    await ownerDb.insert(users).values({ name: 'Persona existente', email, emailVerified: true });
    await sendCode(email);

    const response = await post('/api/auth/sign-in/email-otp', {
      email,
      otp: codeFrom(lastMessageTo(email)),
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ user: { email, name: 'Persona existente' } });
  });

  it('pide el segundo factor a quien tiene TOTP activo, sin abrir la sesión', async () => {
    const email = newEmail();
    const [user] = await ownerDb
      .insert(users)
      .values({ name: 'Persona con TOTP', email, emailVerified: true, twoFactorEnabled: true })
      .returning({ id: users.id });
    if (!user) throw new Error('No se creó la persona de prueba');
    await ownerDb.insert(twoFactors).values({
      userId: user.id,
      secret: 'secreto-cifrado-de-prueba',
      backupCodes: 'codigos-cifrados-de-prueba',
      verified: true,
    });
    await sendCode(email);

    const response = await post('/api/auth/sign-in/email-otp', {
      email,
      otp: codeFrom(lastMessageTo(email)),
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ twoFactorRedirect: true, twoFactorMethods: ['totp'] });
    const session = await app.inject({
      method: 'GET',
      url: '/api/auth/get-session',
      headers: { cookie: cookieHeader(response.headers['set-cookie']) },
    });
    expect(session.json()).toBeNull();
  });

  it('ya no expone el enlace mágico ni las passkeys', async () => {
    const removed = await Promise.all([
      app.inject({ method: 'GET', url: '/api/auth/magic-link/verify?token=x' }),
      post('/api/auth/sign-in/magic-link', { email: newEmail() }),
      app.inject({ method: 'GET', url: '/api/auth/passkey/generate-register-options' }),
      app.inject({ method: 'GET', url: '/api/auth/passkey/generate-authenticate-options' }),
      post('/api/auth/passkey/verify-authentication', { response: {} }),
      app.inject({ method: 'GET', url: '/api/auth/passkey/list-user-passkeys' }),
    ]);

    expect(removed.map((response) => response.statusCode)).toEqual([404, 404, 404, 404, 404, 404]);
  });
});

function newEmail(): string {
  const email = `otp-${randomUUID().slice(0, 8)}@example.test`;
  emails.push(email);
  return email;
}

function post(url: string, payload: Record<string, unknown>) {
  return app.inject({
    method: 'POST',
    url,
    headers: { origin: process.env.WEB_ORIGIN },
    payload,
  });
}

function sendCode(email: string) {
  return post('/api/auth/email-otp/send-verification-otp', { email, type: 'sign-in' });
}

function lastMessageTo(email: string): SentMessage {
  const message = sentMessages.findLast((sent) => sent.to === email);
  if (!message) throw new Error(`No se envió ningún correo a ${email}`);
  return message;
}

function codeFrom(message: SentMessage): string {
  const otp = /\b(\d{6})\b/.exec(message.text)?.[1];
  if (!otp) throw new Error('El correo no trae un código de 6 dígitos');
  return otp;
}

/** Convierte las cabeceras Set-Cookie de la respuesta en una cabecera Cookie para la siguiente petición. */
function cookieHeader(setCookie: string | string[] | undefined): string {
  const cookies = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  return cookies.map((cookie) => cookie.split(';')[0]).join('; ');
}
