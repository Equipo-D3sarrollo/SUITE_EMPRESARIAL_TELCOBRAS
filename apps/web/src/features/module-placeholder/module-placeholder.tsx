import { Link, useParams } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@telcobras/ui';
import { NotFoundView } from '@/app/route-states';
import { t } from '@/i18n/es-CO';
import { moduleIcon } from '@/shell/module-icons';
import { moduleLabel, submoduleLabel, useAllowedModules } from '@/shell/navigation';
import { Workspace } from '@/shell/zone2-workspace/workspace';
import { ContextPanel } from '@/shell/zone3-context/context-panel';
import { deliveryStage } from './stages';

/**
 * Submódulo sin contenido en esta etapa: estado vacío en la Zona 2 y ficha mínima en la Zona 3.
 * Un submódulo que el rol no puede ver (o que no existe) responde como página inexistente.
 */
export function ModulePlaceholder() {
  const params = useParams({ from: '/app/$module/$submodule' });
  const module = useAllowedModules().find((node) => node.id === params.module);
  const submodule = module?.submodules.find((node) => node.id === params.submodule);

  if (!module || !submodule) {
    return (
      <Workspace routeKey="not-found" title={t.common.notFoundTitle}>
        <NotFoundView />
      </Workspace>
    );
  }

  const routeKey = `${module.id}/${submodule.id}`;
  const stage = deliveryStage(module.id, submodule.id);
  const title = submoduleLabel(module.id, submodule.id);

  return (
    <>
      <Workspace routeKey={routeKey} eyebrow={moduleLabel(module.id)} title={title}>
        <Card>
          <EmptyState
            icon={moduleIcon(module)}
            title={title}
            description={t.placeholder.availableInStage(stage)}
          />
        </Card>
      </Workspace>
      <ContextPanel routeKey={routeKey}>
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>{t.placeholder.contextTitle}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="font-medium">{t.placeholder.moduleLabel}</dt>
              <dd>{moduleLabel(module.id, true)}</dd>
              <dt className="font-medium">{t.placeholder.stageLabel}</dt>
              <dd className="tabular-nums">{stage}</dd>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>{t.placeholder.submodulesLabel}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-0.5 text-sm">
              {module.submodules.map((sub) => (
                <li key={sub.id}>
                  <Link
                    to="/app/$module/$submodule"
                    params={{ module: module.id, submodule: sub.id }}
                    className="block rounded-sm px-2 py-1.5 underline-offset-2 outline-tb-azul hover:bg-tb-gris/15 focus-visible:outline-2"
                    activeProps={{ className: 'font-semibold underline' }}
                  >
                    {submoduleLabel(module.id, sub.id)}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </ContextPanel>
    </>
  );
}
