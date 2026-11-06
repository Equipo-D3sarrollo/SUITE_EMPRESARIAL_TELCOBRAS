import type { ModuleId } from '@telcobras/contracts';

// Etapa en la que llega cada módulo, según la ruta de abordaje (documento madre §15).
const MODULE_STAGE: Record<ModuleId, number> = {
  dashboard: 1,
  commercial: 2,
  leadgen: 3,
  documents: 4,
  integrations: 3,
  automation: 4,
  ai: 6,
  analytics: 5,
  administration: 1,
  help: 5,
};

// Submódulos que llegan en otra etapa que su módulo: "módulo/submódulo".
const SUBMODULE_STAGE: Partial<Record<string, number>> = {
  'dashboard/quick-metrics': 5,
  'dashboard/operations-summary': 5,
  'documents/document-center': 2,
  'administration/subscription': 5,
  'help/network-status': 3,
};

export function deliveryStage(moduleId: ModuleId, submoduleId: string): number {
  return SUBMODULE_STAGE[`${moduleId}/${submoduleId}`] ?? MODULE_STAGE[moduleId];
}
