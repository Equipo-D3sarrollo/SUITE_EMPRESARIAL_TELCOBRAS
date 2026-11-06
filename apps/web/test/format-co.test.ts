import { describe, expect, it } from 'vitest';
import { formatCop, formatDate, formatNit } from '@/lib/format-co';

// Intl separa el símbolo con un espacio duro (U+00A0).
const normalizeSpaces = (text: string) => text.replace(/\s/g, ' ');

describe('formatos colombianos', () => {
  it('pesos sin decimales y con punto de miles', () => {
    expect(normalizeSpaces(formatCop(84_500_000))).toBe('$ 84.500.000');
    expect(normalizeSpaces(formatCop(1234.6))).toBe('$ 1.235');
  });

  it('fechas en la hora de Bogotá, no en la del navegador', () => {
    // 03:00 UTC del 5 de noviembre son las 22:00 del 4 de noviembre en Bogotá (UTC-5).
    expect(formatDate('2026-11-05T03:00:00Z')).toBe('4/11/2026');
  });

  it('NIT con puntos de miles sin perder dígitos', () => {
    expect(formatNit('900123456-7')).toBe('900.123.456-7');
    expect(formatNit('1234-5')).toBe('1.234-5');
    expect(formatNit('no-es-nit')).toBe('no-es-nit');
  });
});
