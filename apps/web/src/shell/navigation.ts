import { useSuspenseQuery } from '@tanstack/react-query';
import { filterNavigation, MODULE_IDS, type ModuleId, type ModuleNode } from '@telcobras/contracts';
import { t } from '@/i18n/es-CO';
import { permissionsQuery } from '@/lib/queries';

/** Módulos y submódulos que los permisos del usuario en la organización activa le dejan ver. */
export function useAllowedModules(): ModuleNode[] {
  const { data } = useSuspenseQuery(permissionsQuery);
  return filterNavigation(new Set(data.permissions));
}

/** "1. Inicio": el número sigue el orden fijo del documento madre §12.2, aunque el rol oculte módulos. */
export function moduleLabel(id: ModuleId, numbered = false): string {
  const label = t.navigation[id].label;
  return numbered ? `${MODULE_IDS.indexOf(id) + 1}. ${label}` : label;
}

export function submoduleLabel(moduleId: ModuleId, submoduleId: string): string {
  const labels: Record<string, string> = t.navigation[moduleId].submodules;
  return labels[submoduleId] ?? submoduleId;
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/**
 * Filtra el árbol por texto, sin tildes ni mayúsculas. Si coincide el nombre del módulo, quedan todos sus
 * submódulos; si no, solo los submódulos que coinciden. Sin texto devuelve el árbol tal cual.
 */
export function matchNavigation(modules: readonly ModuleNode[], query: string): ModuleNode[] {
  const needle = normalize(query.trim());
  if (!needle) return [...modules];
  return modules.flatMap((module) => {
    if (normalize(moduleLabel(module.id)).includes(needle)) return [module];
    const submodules = module.submodules.filter((sub) =>
      normalize(submoduleLabel(module.id, sub.id)).includes(needle),
    );
    return submodules.length > 0 ? [{ ...module, submodules }] : [];
  });
}
