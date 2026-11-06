import { createFileRoute, redirect } from '@tanstack/react-router';
import { filterNavigation } from '@telcobras/contracts';
import { permissionsQuery } from '@/lib/queries';
import { NoModulesView } from '@/shell/no-modules-view';

export const Route = createFileRoute('/app/')({
  // Entra al primer submódulo que el rol permite ver.
  beforeLoad: async ({ context }) => {
    const { permissions } = await context.queryClient.ensureQueryData(permissionsQuery);
    const [first] = filterNavigation(new Set(permissions));
    const submodule = first?.submodules[0];
    if (first && submodule) {
      throw redirect({
        to: '/app/$module/$submodule',
        params: { module: first.id, submodule: submodule.id },
      });
    }
  },
  component: NoModulesView,
});
