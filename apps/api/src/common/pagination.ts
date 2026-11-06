import { BadRequestException } from '@nestjs/common';
import type { CursorPage } from '@telcobras/contracts';
import { type AnyColumn, desc, type SQL, sql } from 'drizzle-orm';
import { z } from 'zod';

/**
 * Paginación por cursor (keyset) sobre (created_at, id), en orden descendente, apoyada en los índices
 * (organization_id, created_at, id). Uso en un servicio, con { cursor, limit } ya validados por cursorPageQuerySchema:
 *
 *   const rows = await tx.select({ id: t.id, createdAt: t.createdAt, ... }).from(t)
 *     .where(afterCursor(t, cursor)).orderBy(...newestFirst(t)).limit(limit + 1);
 *   return toCursorPage(rows, limit);
 */
interface CursorColumns {
  createdAt: AnyColumn;
  id: AnyColumn;
}

interface CursorPosition {
  createdAt: Date;
  id: string;
}

const cursorSchema = z.tuple([z.iso.datetime(), z.uuid()]);

export function encodeCursor({ createdAt, id }: CursorPosition): string {
  return Buffer.from(JSON.stringify([createdAt.toISOString(), id])).toString('base64url');
}

export function decodeCursor(cursor: string): CursorPosition {
  let decoded: unknown;
  try {
    decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
  } catch {
    decoded = undefined;
  }
  const result = cursorSchema.safeParse(decoded);
  if (!result.success) throw new BadRequestException('Invalid cursor');
  const [createdAt, id] = result.data;
  return { createdAt: new Date(createdAt), id };
}

/** Condición "después del cursor"; sin cursor no filtra (primera página). */
export function afterCursor(columns: CursorColumns, cursor: string | undefined): SQL | undefined {
  if (cursor === undefined) return undefined;
  const position = decodeCursor(cursor);
  // Comparación de filas: PostgreSQL la resuelve con un solo rango sobre el índice compuesto.
  return sql`(${columns.createdAt}, ${columns.id}) < (${position.createdAt.toISOString()}::timestamptz, ${position.id}::uuid)`;
}

export const newestFirst = (columns: CursorColumns) => [desc(columns.createdAt), desc(columns.id)];

/** Recorta la fila de más (la consulta pide limit + 1) y arma el cursor de la página siguiente. */
export function toCursorPage<T extends CursorPosition>(rows: T[], limit: number): CursorPage<T> {
  const items = rows.slice(0, limit);
  const last = items.at(-1);
  return { items, nextCursor: rows.length > limit && last ? encodeCursor(last) : null };
}
