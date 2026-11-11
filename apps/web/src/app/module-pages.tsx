import { useParams } from '@tanstack/react-router';
import { Skeleton } from '@telcobras/ui';
import { type ComponentType, type LazyExoticComponent, lazy, Suspense } from 'react';
import { ModulePlaceholder } from '@/features/module-placeholder/module-placeholder';
import { t } from '@/i18n/es-CO';
import { useAllowedModules } from '@/shell/navigation';
import { Workspace } from '@/shell/zone2-workspace/workspace';

type Page = LazyExoticComponent<ComponentType>;

// Submódulos ya construidos, "módulo/submódulo". Se cargan bajo demanda: no entran en el bundle inicial.
const PAGES: Partial<Record<string, Page>> = {
  'documents/invoices': lazy(() =>
    import('@/features/datadian/invoices-page').then((m) => ({ default: m.InvoicesPage })),
  ),
  'documents/dian': lazy(() =>
    import('@/features/datadian/dian-page').then((m) => ({ default: m.DianPage })),
  ),
  'documents/settings': lazy(() =>
    import('@/features/datadian/settings-page').then((m) => ({ default: m.SettingsPage })),
  ),
};

/**
 * Página de /app/$module/$submodule: la del submódulo si ya existe y el rol puede verla; si no, la
 * vista de reserva, que también responde "página inexistente" a lo que el rol no ve.
 */
export function ModulePage() {
  const { module, submodule } = useParams({ from: '/app/$module/$submodule' });
  const allowed = useAllowedModules()
    .find((node) => node.id === module)
    ?.submodules.some((node) => node.id === submodule);
  const Page = allowed ? PAGES[`${module}/${submodule}`] : undefined;
  if (!Page) return <ModulePlaceholder />;

  return (
    <Suspense
      fallback={
        <Workspace routeKey="loading" title={t.common.loading}>
          <Skeleton className="h-64 w-full" />
        </Workspace>
      }
    >
      <Page />
    </Suspense>
  );
}
