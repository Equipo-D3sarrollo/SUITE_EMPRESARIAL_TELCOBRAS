// Prueba de aislamiento entre organizaciones (ADR-004, ADR-005, plan §1.5): las 7 pruebas de poc/rls
// sobre las tablas reales, más auditoría append-only, "mis organizaciones", onboarding y llaves compuestas.
import { randomUUID } from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  auditLogs,
  memberships,
  organizations,
  permissions,
  rolePermissions,
  roles,
} from '../src/database/schema/index.js';
import { withTenant, withUser } from '../src/database/tenant.js';
import {
  appDatabase,
  createOrganization,
  dropOrganizations,
  ownerDatabase,
  pgErrorOf,
} from './support/database.js';

// Pool de 1 conexión: obliga a reutilizar la misma conexión y así detectar fugas del tenant.
const single = appDatabase(1);
const pool = appDatabase(5);
const owner = ownerDatabase();

const A = randomUUID();
const B = randomUUID();
const userA = randomUUID();
const userB = randomUUID();
const asA = { orgId: A, userId: userA };
const asB = { orgId: B, userId: userB };
const created = [A, B];

beforeAll(async () => {
  await createOrganization(single, asA);
  await createOrganization(single, asB);
  await withTenant(single, asA, (tx) =>
    tx.insert(memberships).values({ organizationId: A, userId: userA }),
  );
  await withTenant(single, asB, (tx) =>
    tx.insert(memberships).values({ organizationId: B, userId: userB }),
  );
});

afterAll(async () => {
  await dropOrganizations(owner, created);
  await Promise.all([single.$client.end(), pool.$client.end(), owner.$client.end()]);
});

const roleKeys = (rows: { key: string }[]) => rows.map((row) => row.key);

describe('aislamiento por organización (RLS)', () => {
  it('cada organización inserta y ve solo lo suyo', async () => {
    await withTenant(single, asA, (tx) =>
      tx.insert(roles).values({ organizationId: A, key: 'acme', name: 'Acme' }),
    );
    await withTenant(single, asB, (tx) =>
      tx.insert(roles).values({ organizationId: B, key: 'beta', name: 'Beta' }),
    );
    const a = await withTenant(single, asA, (tx) => tx.select({ key: roles.key }).from(roles));
    const b = await withTenant(single, asB, (tx) => tx.select({ key: roles.key }).from(roles));
    expect(roleKeys(a)).toEqual(['acme']);
    expect(roleKeys(b)).toEqual(['beta']);
  });

  it('sin organización fijada no se ve nada (falla cerrado)', async () => {
    expect(await single.select({ id: roles.id }).from(roles)).toHaveLength(0);
    expect(await single.select({ id: organizations.id }).from(organizations)).toHaveLength(0);
    expect(await single.select({ id: memberships.id }).from(memberships)).toHaveLength(0);
  });

  it('el tenant no se filtra a la siguiente petición en la misma conexión', async () => {
    await withTenant(single, asA, (tx) => tx.select({ id: roles.id }).from(roles));
    // Misma conexión física (pool de 1), fuera de la transacción: el set_config local ya expiró.
    expect(await single.select({ id: roles.id }).from(roles)).toHaveLength(0);
    const { rows } = await single.execute<{ org: string | null }>(
      sql`select current_setting('app.org_id', true) as org`,
    );
    expect(rows[0]?.org || null).toBeNull();
  });

  it('A no puede insertar filas a nombre de B', async () => {
    const error = await pgErrorOf(
      withTenant(single, asA, (tx) =>
        tx.insert(roles).values({ organizationId: B, key: 'intrusa', name: 'Intrusa' }),
      ),
    );
    expect(error.message).toMatch(/row-level security/);
  });

  it('A no puede modificar ni borrar filas de B', async () => {
    const updated = await withTenant(single, asA, (tx) =>
      tx.update(roles).set({ name: 'Hackeada' }).where(eq(roles.key, 'beta')).returning(),
    );
    const deleted = await withTenant(single, asA, (tx) =>
      tx.delete(roles).where(eq(roles.key, 'beta')).returning(),
    );
    expect(updated).toHaveLength(0);
    expect(deleted).toHaveLength(0);
    const b = await withTenant(single, asB, (tx) =>
      tx.select({ key: roles.key, name: roles.name }).from(roles),
    );
    expect(b).toEqual([{ key: 'beta', name: 'Beta' }]);
  });

  it('transacciones concurrentes en un pool de 5 no se mezclan', async () => {
    const runs = Array.from({ length: 40 }, (_, i) => (i % 2 ? asA : asB)).map((scope) =>
      withTenant(pool, scope, async (tx) => {
        await tx.execute(sql`select pg_sleep(0.01)`);
        const rows = await tx.select({ organizationId: roles.organizationId }).from(roles);
        return { orgId: scope.orgId, rows };
      }),
    );
    for (const { orgId, rows } of await Promise.all(runs)) {
      expect(rows.length).toBeGreaterThan(0);
      expect(rows.every((row) => row.organizationId === orgId)).toBe(true);
    }
  });

  it('el rol de la aplicación no salta RLS y el dueño también queda restringido (FORCE)', async () => {
    const { rows: role } = await pool.execute<{ rolbypassrls: boolean; rolsuper: boolean }>(
      sql`select rolbypassrls, rolsuper from pg_roles where rolname = current_user`,
    );
    expect(role[0]).toEqual({ rolbypassrls: false, rolsuper: false });
    expect(await owner.select({ id: roles.id }).from(roles)).toHaveLength(0);

    // Toda tabla de negocio (las que tienen organization_id, más organizations) tiene RLS forzado.
    const { rows: tables } = await owner.execute<{
      relname: string;
      relrowsecurity: boolean;
      relforcerowsecurity: boolean;
    }>(sql`
      select c.relname, c.relrowsecurity, c.relforcerowsecurity
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'app' and c.relkind = 'r'
        and (c.relname = 'organizations' or exists (
          select 1 from pg_attribute a
          where a.attrelid = c.oid and a.attname = 'organization_id' and not a.attisdropped))`);
    expect(tables.length).toBeGreaterThanOrEqual(7);
    for (const table of tables) {
      expect(table, table.relname).toMatchObject({
        relrowsecurity: true,
        relforcerowsecurity: true,
      });
    }
  });
});

describe('auditoría append-only', () => {
  it('app_user inserta y lee en su organización, pero no puede modificar ni borrar', async () => {
    const entry = {
      organizationId: A,
      actorUserId: userA,
      action: 'role.create',
      resourceType: 'role',
      result: 'success' as const,
    };
    await withTenant(single, asA, (tx) => tx.insert(auditLogs).values(entry));
    const mine = await withTenant(single, asA, (tx) =>
      tx.select({ action: auditLogs.action }).from(auditLogs),
    );
    expect(mine).toEqual([{ action: 'role.create' }]);
    const others = await withTenant(single, asB, (tx) =>
      tx.select({ id: auditLogs.id }).from(auditLogs),
    );
    expect(others).toHaveLength(0);

    const update = await pgErrorOf(
      withTenant(single, asA, (tx) => tx.update(auditLogs).set({ action: 'tampered' })),
    );
    const remove = await pgErrorOf(withTenant(single, asA, (tx) => tx.delete(auditLogs)));
    expect(update).toMatchObject({
      code: '42501',
      message: expect.stringMatching(/permission denied/),
    });
    expect(remove).toMatchObject({
      code: '42501',
      message: expect.stringMatching(/permission denied/),
    });
  });
});

describe('membresías y onboarding', () => {
  it('un usuario ve solo las organizaciones donde tiene membresía', async () => {
    const [orgs, own] = await withUser(single, userA, async (tx) => [
      await tx.select({ id: organizations.id }).from(organizations),
      await tx.select({ userId: memberships.userId }).from(memberships),
    ]);
    expect(orgs).toEqual([{ id: A }]);
    expect(own).toEqual([{ userId: userA }]);
  });

  it('un usuario crea organizaciones solo a su propio nombre', async () => {
    const asC = { orgId: randomUUID(), userId: randomUUID() };
    created.push(asC.orgId);
    await createOrganization(single, asC);
    const error = await pgErrorOf(
      withUser(single, asC.userId, (tx) =>
        tx.insert(organizations).values({
          name: 'Suplantada',
          legalName: 'Suplantada S.A.S.',
          nit: '123456789-6',
          size: '1-10',
          createdBy: userA,
        }),
      ),
    );
    expect(error.message).toMatch(/row-level security/);
  });

  it('una organización no puede enlazar roles de otra (llaves foráneas compuestas)', async () => {
    await owner.insert(permissions).values({ key: 'roles:read' }).onConflictDoNothing();
    const link = (roleId: string) =>
      withTenant(single, asA, (tx) =>
        tx
          .insert(rolePermissions)
          .values({ organizationId: A, roleId, permissionKey: 'roles:read' }),
      );
    const [roleOfA] = await withTenant(single, asA, (tx) =>
      tx.select({ id: roles.id }).from(roles),
    );
    const [roleOfB] = await withTenant(single, asB, (tx) =>
      tx.select({ id: roles.id }).from(roles),
    );
    if (!roleOfA || !roleOfB) throw new Error('Missing test roles');

    await link(roleOfA.id);
    expect((await pgErrorOf(link(roleOfB.id))).code).toBe('23503');
  });
});
