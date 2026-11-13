import type { ModuleId } from '@telcobras/contracts';

// Etapa en la que llega cada módulo, según el orden definitivo de ADR-014 y su enmienda
// (docs/etapas/README.md y docs/PENDIENTES.md §3): DataDian ocupa las etapas 2 a 5 y el CRM es la 6.
const MODULE_STAGE: Record<ModuleId, number> = {
  dashboard: 1,
  commercial: 6,
  leadgen: 7,
  documents: 2,
  integrations: 7,
  automation: 8,
  ai: 10,
  analytics: 9,
  administration: 1,
  help: 9,
};

// Submódulos que llegan en otra etapa que su módulo: "módulo/submódulo".
const SUBMODULE_STAGE: Partial<Record<string, number>> = {
  'dashboard/quick-metrics': 9,
  'dashboard/operations-summary': 9,
  'administration/subscription': 9,
  'help/network-status': 7,
};

export function deliveryStage(moduleId: ModuleId, submoduleId: string): number {
  return SUBMODULE_STAGE[`${moduleId}/${submoduleId}`] ?? MODULE_STAGE[moduleId];
}
