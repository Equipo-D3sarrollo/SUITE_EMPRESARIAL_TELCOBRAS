import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './page-size.js';

export { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE };

/** Parámetros de una lista paginada por cursor (keyset). Ninguna lista responde sin límite. */
export const cursorPageQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

/** Página de resultados: `nextCursor` es null cuando no hay más. */
export const cursorPageSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });

export type CursorPageQuery = z.infer<typeof cursorPageQuerySchema>;
export type CursorPage<T> = { items: T[]; nextCursor: string | null };
