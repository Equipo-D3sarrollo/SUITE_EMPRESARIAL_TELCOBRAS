// Semillas: catálogo de permisos y dos organizaciones de demostración con sus roles. Se puede correr varias veces.
// Todo es ficticio (NIT de ejemplo, sin usuarios ni datos de clientes reales). Corre como app_owner.
import { PERMISSIONS } from '@telcobras/contracts';
import { z } from 'zod';
import { createDatabase } from './database.js';
import { organizations, permissions } from './schema/index.js';
import { insertSeedRoles } from './seed-roles.js';
import { withTenant } from './tenant.js';

const DEMO_CREATOR_ID = '00000000-0000-7000-8000-000000000001';

const DEMO_ORGANIZATIONS = [
  {
    id: '00000000-0000-7000-8000-000000000101',
    name: 'Demo Andina',
    legalName: 'Demo Andina S.A.S.',
    nit: '123456789-6',
    size: '11-50',
  },
  {
    id: '00000000-0000-7000-8000-000000000102',
    name: 'Demo Caribe',
    legalName: 'Demo Caribe S.A.S.',
    nit: '987654321-7',
    size: '1-10',
  },
] as const;

const db = createDatabase(z.url().parse(process.env.DATABASE_OWNER_URL), 1);
try {
  // permissions no tiene RLS: es el catálogo global.
  await db
    .insert(permissions)
    .values(PERMISSIONS.map((key) => ({ key })))
    .onConflictDoNothing();

  // El catálogo sí se sincroniza en producción; las organizaciones de demostración nunca.
  // FORCE RLS aplica también a app_owner: cada organización se siembra dentro de su propio contexto.
  for (const organization of process.env.NODE_ENV === 'production' ? [] : DEMO_ORGANIZATIONS) {
    await withTenant(db, { orgId: organization.id, userId: DEMO_CREATOR_ID }, async (tx) => {
      await tx
        .insert(organizations)
        .values({ ...organization, createdBy: DEMO_CREATOR_ID })
        .onConflictDoNothing();
      await insertSeedRoles(tx, organization.id);
    });
  }
} finally {
  await db.$client.end();
}
