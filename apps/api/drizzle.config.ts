import { defineConfig } from 'drizzle-kit';

// Solo para generar migraciones (pnpm db:generate). Se aplican con src/database/migrate.ts, como app_owner.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  schemaFilter: ['app'],
  strict: true,
});
