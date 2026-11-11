// Esquema completo: lo leen drizzle-kit (drizzle.config.ts) y el cliente de la API (database.ts).
// Cada archivo nuevo de tablas (por ejemplo, las de Better Auth) se agrega aquí con su export.
// appSchema no se exporta a propósito: así drizzle-kit no genera un CREATE SCHEMA "app" que ya existe.
export * from './audit-logs.js';
export * from './auth.js';
export * from './dian-extraction.js';
export * from './invitations.js';
export * from './memberships.js';
export * from './odoo-connections.js';
export * from './organizations.js';
export * from './rbac.js';
export * from './received-documents.js';
