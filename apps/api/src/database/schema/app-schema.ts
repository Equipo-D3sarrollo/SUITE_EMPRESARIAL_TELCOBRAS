import { pgSchema } from 'drizzle-orm/pg-core';

/**
 * Esquema "app" de PostgreSQL: todas las tablas de la aplicación, también las de Better Auth.
 * Lo crea infra/compose/postgres/init.sql con dueño app_owner.
 */
export const appSchema = pgSchema('app');
