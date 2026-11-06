// Formatos de Colombia con Intl (documento madre §12.4.2): pesos sin decimales, fechas en hora de Bogotá y NIT con puntos.
const LOCALE = 'es-CO';
const TIME_ZONE = 'America/Bogota';

const copFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeZone: TIME_ZONE });

/** 84500000 → "$ 84.500.000". */
export function formatCop(value: number): string {
  return copFormatter.format(value);
}

/** Fecha corta (día/mes/año) en la zona horaria de Bogotá: "4/11/2026". */
export function formatDate(value: Date | string): string {
  return dateFormatter.format(new Date(value));
}

/** "900123456-7" → "900.123.456-7". Si no es un NIT normalizado, lo devuelve igual. */
export function formatNit(nit: string): string {
  if (!/^\d+-\d$/.test(nit)) return nit;
  // Separa los miles con puntos sin pasar por Number, para no perder dígitos.
  return nit.replace(/\B(?=(\d{3})+-)/g, '.');
}
