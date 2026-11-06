import { boolean, foreignKey, index, primaryKey, text, unique, uuid } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';
import { createdAt, id, updatedAt } from './columns.js';
import { memberships } from './memberships.js';
import { organizations } from './organizations.js';

/** Catálogo global de permisos "recurso:acción" (sin RLS). Se llena desde @telcobras/contracts con db:seed. */
export const permissions = appSchema.table('permissions', {
  key: text('key').primaryKey(),
});

/** Rol configurable de una organización. Los roles semilla llevan is_system = true. */
export const roles = appSchema.table(
  'roles',
  {
    id: id(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    isSystem: boolean('is_system').notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique('roles_organization_id_key_key').on(t.organizationId, t.key),
    unique('roles_organization_id_id_key').on(t.organizationId, t.id),
    index('roles_cursor_idx').on(t.organizationId, t.createdAt, t.id),
  ],
);

export const rolePermissions = appSchema.table(
  'role_permissions',
  {
    organizationId: uuid('organization_id').notNull(),
    roleId: uuid('role_id').notNull(),
    permissionKey: text('permission_key')
      .notNull()
      .references(() => permissions.key),
  },
  (t) => [
    primaryKey({ columns: [t.organizationId, t.roleId, t.permissionKey] }),
    foreignKey({
      name: 'role_permissions_role_fk',
      columns: [t.organizationId, t.roleId],
      foreignColumns: [roles.organizationId, roles.id],
    }).onDelete('cascade'),
  ],
);

export const membershipRoles = appSchema.table(
  'membership_roles',
  {
    organizationId: uuid('organization_id').notNull(),
    membershipId: uuid('membership_id').notNull(),
    roleId: uuid('role_id').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.organizationId, t.membershipId, t.roleId] }),
    foreignKey({
      name: 'membership_roles_membership_fk',
      columns: [t.organizationId, t.membershipId],
      foreignColumns: [memberships.organizationId, memberships.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'membership_roles_role_fk',
      columns: [t.organizationId, t.roleId],
      foreignColumns: [roles.organizationId, roles.id],
    }).onDelete('cascade'),
    index('membership_roles_role_idx').on(t.organizationId, t.roleId),
  ],
);
