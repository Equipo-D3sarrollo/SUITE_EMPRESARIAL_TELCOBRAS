import { z } from 'zod';

// Pesos de la DIAN para el dígito de verificación, aplicados de derecha a izquierda sobre la base del NIT.
const DV_WEIGHTS = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71] as const;

/** Dígito de verificación (DV) de un NIT colombiano, según el algoritmo de módulo 11 de la DIAN. */
export function computeNitCheckDigit(base: string): number {
  if (!/^\d{1,15}$/.test(base)) throw new RangeError('NIT base must have 1 to 15 digits');
  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    sum += Number(base[base.length - 1 - i]) * (DV_WEIGHTS[i] ?? 0);
  }
  const remainder = sum % 11;
  return remainder > 1 ? 11 - remainder : remainder;
}

const NIT_PATTERN = /^(\d{6,15})-(\d)$/;

/**
 * NIT con dígito de verificación: "900123456-7" o "900.123.456-7".
 * Se normaliza sin puntos ni espacios, y falla si el DV no corresponde a la base.
 */
export const nitSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[.\s]/g, ''))
  .pipe(
    z
      .string()
      .regex(NIT_PATTERN, { error: 'nit.format' })
      .refine(
        (value) => {
          // Zod 4 corre este refine aunque falle el regex; ese caso ya quedó reportado como 'nit.format'.
          const [, base, dv] = NIT_PATTERN.exec(value) ?? [];
          return base === undefined || computeNitCheckDigit(base) === Number(dv);
        },
        { error: 'nit.checkDigit' },
      ),
  );
