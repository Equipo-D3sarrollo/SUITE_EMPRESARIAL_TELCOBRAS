import { describe, expect, it } from 'vitest';
import { computeNitCheckDigit, nitSchema } from '../src/schemas/nit.js';

describe('computeNitCheckDigit', () => {
  it.each([
    ['800197268', 4], // DIAN
    ['890903938', 8], // Bancolombia
    ['860002964', 4], // Banco de Bogotá
  ])('calcula el DV de %s', (base, dv) => {
    expect(computeNitCheckDigit(base)).toBe(dv);
  });

  it('rechaza bases que no son dígitos', () => {
    expect(() => computeNitCheckDigit('80019726A')).toThrow(RangeError);
  });
});

describe('nitSchema', () => {
  it('normaliza puntos y espacios', () => {
    expect(nitSchema.parse(' 800.197.268-4 ')).toBe('800197268-4');
  });

  it('rechaza un DV incorrecto', () => {
    const result = nitSchema.safeParse('800197268-5');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('nit.checkDigit');
  });

  it('exige el guion antes del DV', () => {
    const result = nitSchema.safeParse('8001972684');
    expect(result.error?.issues[0]?.message).toBe('nit.format');
  });
});
