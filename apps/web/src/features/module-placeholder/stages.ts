import type { ModuleId } from '@telcobras/contracts';

// Etapa en la que llega cada módulo, según la ruta de etapas de ADR-014 (documento madre §15).
// DataDian ocupa las etapas 2 a 8; las que seguían al CRM solo cambiaron de número.
const MODULE_STAGE: Record<ModuleId, number> = {
  dashboard: 1,
  commercial: 9,
  leadgen: 10,
  documents: 2,
  integrations: 10,
  automation: 11,
  ai: 13,
  analytics: 12,
  administration: 1,
  help: 12,
};

// Submódulos que llegan en otra etapa que su módulo: "módulo/submódulo".
const SUBMODULE_STAGE: Partial<Record<string, number>> = {
  'dashboard/quick-metrics': 12,
  'dashboard/operations-summary': 12,
  'administration/subscription': 12,
  'help/network-status': 10,
};

export function deliveryStage(moduleId: ModuleId, submoduleId: string): number {
  return SUBMODULE_STAGE[`${moduleId}/${submoduleId}`] ?? MODULE_STAGE[moduleId];
}
