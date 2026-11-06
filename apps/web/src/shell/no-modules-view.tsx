import { EmptyState } from '@telcobras/ui';
import { Lock } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { Workspace } from './zone2-workspace/workspace';

/** /app cuando el rol no permite ver ningún módulo. */
export function NoModulesView() {
  return (
    <Workspace routeKey="no-modules" title={t.brand.productName}>
      <EmptyState icon={Lock} title={t.shell.sidebar.noModules} />
    </Workspace>
  );
}
