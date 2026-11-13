import { createFileRoute } from '@tanstack/react-router';
import { ModulePage } from '@/app/module-pages';

/**
 * Parámetros de búsqueda como texto plano: cada submódulo los valida con su propio esquema (por
 * ejemplo, `inboxSearchSchema` de DataDian) y cae a sus valores por defecto si llegan mal.
 */
export type SubmoduleSearch = Record<string, string | undefined>;

export const Route = createFileRoute('/app/$module/$submodule')({
  validateSearch: (search: Record<string, unknown>): SubmoduleSearch =>
    Object.fromEntries(
      Object.entries(search)
        .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
        .map(([key, value]) => [key, String(value)]),
    ),
  component: ModulePage,
});
