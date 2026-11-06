import { describe, expect, it } from 'vitest';
import { parseEnv } from '../src/config/env.js';

const errorOf = (source: NodeJS.ProcessEnv) => {
  try {
    parseEnv(source);
  } catch (error) {
    return (error as Error).message;
  }
  throw new Error('Expected parseEnv to fail');
};

describe('configuración', () => {
  it('no arranca si falta una variable', () => {
    const { DATABASE_URL: _, ...withoutDatabase } = process.env;
    expect(errorOf(withoutDatabase)).toMatch(/DATABASE_URL/);
  });

  it('el error nombra la variable inválida sin mostrar su valor', () => {
    const message = errorOf({ ...process.env, BETTER_AUTH_SECRET: 'secreto-corto' });
    expect(message).toMatch(/BETTER_AUTH_SECRET/);
    expect(message).not.toMatch(/secreto-corto/);
  });

  it('convierte tipos y trata las opcionales vacías como ausentes', () => {
    const env = parseEnv({ ...process.env, API_PORT: '3000', GOOGLE_CLIENT_ID: '' });
    expect(env.API_PORT).toBe(3000);
    expect(env.GOOGLE_CLIENT_ID).toBeUndefined();
  });
});
