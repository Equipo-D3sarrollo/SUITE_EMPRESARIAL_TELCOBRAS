import { sql } from 'drizzle-orm';
import { type AnyPgColumn, check, timestamp, uuid } from 'drizzle-orm/pg-core';

// uuidv7() (PostgreSQL 18) ordena por tiempo: índices compactos y cursores estables.
export const id = () => uuid('id').primaryKey().default(sql`uuidv7()`);

// Precisión de milisegundos, igual que Date en JS: el cursor (created_at, id) no pierde filas.
const timestampMs = (name: string) => timestamp(name, { withTimezone: true, precision: 3 });

export const createdAt = () => timestampMs('created_at').notNull().defaultNow();

export const updatedAt = () =>
  timestampMs('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const nullableTimestamp = timestampMs;

/** CHECK que limita una columna de texto a una lista fija de valores (estados, tamaños, resultados). */
export const oneOf = (name: string, column: AnyPgColumn, values: readonly string[]) =>
  check(name, sql`${column} in (${sql.raw(values.map((value) => `'${value}'`).join(', '))})`);
