// Los 10 módulos de la Zona 1, en el orden del documento madre §12.2. Los ids son estables: van en URLs y permisos.
export const MODULE_IDS = [
  'dashboard',
  'commercial',
  'leadgen',
  'documents',
  'integrations',
  'automation',
  'ai',
  'analytics',
  'administration',
  'help',
] as const;

export type ModuleId = (typeof MODULE_IDS)[number];
