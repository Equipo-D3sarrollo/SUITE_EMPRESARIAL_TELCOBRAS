// Formatos de DataDian: siempre en hora de Bogotá (§8).
const TIME_ZONE = 'America/Bogota';

const dateTime = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: TIME_ZONE,
});

const weekdayParts = new Intl.DateTimeFormat('es-CO', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: TIME_ZONE,
});

/** "13 nov 2026, 9:40 a. m." */
export function formatDateTime(value: string | Date): string {
  return dateTime.format(new Date(value));
}

/** "jue 19-nov a las 23:59", como pide el semáforo del plazo. */
export function formatDeadline(value: string | Date): string {
  const parts = Object.fromEntries(
    weekdayParts.formatToParts(new Date(value)).map((part) => [part.type, part.value]),
  );
  const weekday = (parts.weekday ?? '').replace('.', '');
  const month = (parts.month ?? '').replace('.', '');
  return `${weekday} ${parts.day}-${month} a las ${parts.hour}:${parts.minute}`;
}

/** Fecha aaaa-mm-dd de un día en Bogotá. */
export function bogotaDate(value: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(value);
}

/** CUFE o CUDE abreviado para mostrar: "a1b2c3d4…e5f6a7b8". */
export function shortHash(value: string): string {
  return value.length > 20 ? `${value.slice(0, 8)}…${value.slice(-8)}` : value;
}
