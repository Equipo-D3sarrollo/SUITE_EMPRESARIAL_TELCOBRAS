import { randomUUID } from 'node:crypto';
import { BadRequestException } from '@nestjs/common';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  afterCursor,
  decodeCursor,
  encodeCursor,
  newestFirst,
  toCursorPage,
} from '../src/common/pagination.js';
import { roles } from '../src/database/schema/index.js';
import { withTenant } from '../src/database/tenant.js';
import {
  appDatabase,
  createOrganization,
  dropOrganizations,
  ownerDatabase,
} from './support/database.js';

describe('cursor', () => {
  it('codifica y decodifica la posición', () => {
    const position = { createdAt: new Date('2026-11-05T10:00:00.123Z'), id: randomUUID() };
    expect(decodeCursor(encodeCursor(position))).toEqual(position);
  });

  it('rechaza cursores alterados con 400', () => {
    for (const cursor of ['nope', Buffer.from('["x","y"]').toString('base64url')]) {
      expect(() => decodeCursor(cursor)).toThrow(BadRequestException);
    }
  });
});

describe('paginación por cursor en PostgreSQL', () => {
  const db = appDatabase(1);
  const owner = ownerDatabase();
  const scope = { orgId: randomUUID(), userId: randomUUID() };

  beforeAll(async () => {
    await createOrganization(db, scope);
    // Misma transacción = mismo created_at: el desempate por id es el que se prueba.
    await withTenant(db, scope, (tx) =>
      tx
        .insert(roles)
        .values(
          ['a', 'b', 'c', 'd', 'e'].map((key) => ({ organizationId: scope.orgId, key, name: key })),
        ),
    );
  });

  afterAll(async () => {
    await dropOrganizations(owner, [scope.orgId]);
    await Promise.all([db.$client.end(), owner.$client.end()]);
  });

  it('recorre todas las filas sin repetir ni saltar', async () => {
    const limit = 2;
    const seen: string[] = [];
    let cursor: string | undefined;
    let pages = 0;
    do {
      const rows = await withTenant(db, scope, (tx) =>
        tx
          .select({ id: roles.id, createdAt: roles.createdAt, key: roles.key })
          .from(roles)
          .where(afterCursor(roles, cursor))
          .orderBy(...newestFirst(roles))
          .limit(limit + 1),
      );
      const page = toCursorPage(rows, limit);
      seen.push(...page.items.map((item) => item.key));
      cursor = page.nextCursor ?? undefined;
      pages += 1;
    } while (cursor);
    expect(pages).toBe(3);
    expect(seen.sort()).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});
