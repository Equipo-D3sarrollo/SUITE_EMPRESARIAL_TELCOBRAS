import type { ModuleId } from '@telcobras/contracts';

// Etapa en la que llega cada módulo, según la ruta de etapas de ADR-013 (documento madre §15).
const MODULE_STAGE: Record<ModuleId, number> = {
  dashboard: 1,
  commercial: 3,
  leadgen: 4,
  documents: 2,
  integrations: 4,
  automation: 5,
  ai: 7,
  analytics: 6,
  administration: 1,
  help: 6,
};

// Submódulos que llegan en otra etapa que su módulo: "módulo/submódulo".
const SUBMODULE_STAGE: Partial<Record<string, number>> = {
  'dashboard/quick-metrics': 6,
  'dashboard/operations-summary': 6,
  'administration/subscription': 6,
  'help/network-status': 4,
};

export function deliveryStage(moduleId: ModuleId, submoduleId: string): number {
  return SUBMODULE_STAGE[`${moduleId}/${submoduleId}`] ?? MODULE_STAGE[moduleId];
}
