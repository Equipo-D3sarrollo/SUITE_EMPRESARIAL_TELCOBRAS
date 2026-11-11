import type { ModuleId } from './modules.js';
import type { Permission } from './permissions.js';

// Árbol de navegación del documento madre §12.2. La ruta de un submódulo es /<módulo>/<submódulo>.
// Los textos visibles viven en apps/web/src/i18n; aquí solo van ids estables, icono de lucide y permiso.
export interface SubmoduleNode {
  readonly id: string;
  readonly permission: Permission;
}

export interface ModuleNode {
  readonly id: ModuleId;
  /** Nombre del icono en lucide (kebab-case). */
  readonly icon: string;
  readonly permission: Permission;
  readonly submodules: readonly SubmoduleNode[];
}

export const NAVIGATION = [
  {
    id: 'dashboard',
    icon: 'layout-dashboard',
    permission: 'dashboard:view',
    submodules: [
      { id: 'overview', permission: 'dashboard:view' },
      { id: 'quick-metrics', permission: 'dashboard:view' },
      { id: 'operations-summary', permission: 'dashboard:view' },
    ],
  },
  {
    id: 'commercial',
    icon: 'briefcase-business',
    permission: 'commercial:view',
    submodules: [
      { id: 'companies', permission: 'commercial:view' },
      { id: 'contacts', permission: 'commercial:view' },
      { id: 'leads', permission: 'commercial:view' },
      { id: 'opportunities', permission: 'commercial:view' },
      { id: 'activities', permission: 'commercial:view' },
      { id: 'pipeline', permission: 'commercial:view' },
    ],
  },
  {
    id: 'leadgen',
    icon: 'radar',
    permission: 'leadgen:view',
    submodules: [
      { id: 'prospecting', permission: 'leadgen:view' },
      { id: 'campaigns', permission: 'leadgen:view' },
      { id: 'data-enrichment', permission: 'leadgen:view' },
    ],
  },
  {
    id: 'documents',
    icon: 'file-text',
    permission: 'documents:view',
    submodules: [
      // DataDian (ADR-013): tablero de facturas recibidas, carga de documentos de la DIAN y configuración.
      { id: 'invoices', permission: 'documents:view' },
      { id: 'dian', permission: 'documents:import' },
      { id: 'settings', permission: 'documents:configure' },
    ],
  },
  {
    id: 'integrations',
    icon: 'plug',
    permission: 'integrations:view',
    submodules: [
      { id: 'connector-hub', permission: 'integrations:view' },
      { id: 'odoo', permission: 'integrations:view' },
      { id: 'whatsapp', permission: 'integrations:view' },
      { id: 'webhooks', permission: 'integrations:view' },
    ],
  },
  {
    id: 'automation',
    icon: 'workflow',
    permission: 'automation:view',
    submodules: [
      { id: 'process-flows', permission: 'automation:view' },
      { id: 'live-triggers', permission: 'automation:view' },
      { id: 'queues', permission: 'automation:view' },
    ],
  },
  {
    id: 'ai',
    icon: 'bot',
    permission: 'ai:view',
    submodules: [
      { id: 'agent-management', permission: 'ai:view' },
      { id: 'agent-runtime', permission: 'ai:view' },
      { id: 'agent-logs', permission: 'ai:view' },
    ],
  },
  {
    id: 'analytics',
    icon: 'chart-line',
    permission: 'analytics:view',
    submodules: [
      { id: 'executive-dashboard', permission: 'analytics:view' },
      { id: 'cross-reports', permission: 'analytics:view' },
      { id: 'bi-export', permission: 'analytics:view' },
    ],
  },
  {
    id: 'administration',
    icon: 'settings',
    permission: 'administration:view',
    submodules: [
      { id: 'organization', permission: 'organization:read' },
      { id: 'roles', permission: 'roles:read' },
      { id: 'subscription', permission: 'administration:view' },
      { id: 'users', permission: 'members:read' },
    ],
  },
  {
    id: 'help',
    icon: 'life-buoy',
    permission: 'help:view',
    submodules: [
      { id: 'help-center', permission: 'help:view' },
      { id: 'noc-support', permission: 'help:view' },
      { id: 'network-status', permission: 'help:view' },
    ],
  },
] as const satisfies readonly ModuleNode[];

export type ModuleIcon = (typeof NAVIGATION)[number]['icon'];

/** Deja solo los módulos y submódulos que los permisos del usuario permiten ver; quita los módulos que quedan vacíos. */
export function filterNavigation(
  granted: ReadonlySet<Permission>,
  tree: readonly ModuleNode[] = NAVIGATION,
): ModuleNode[] {
  return tree.flatMap((module) => {
    if (!granted.has(module.permission)) return [];
    const submodules = module.submodules.filter((sub) => granted.has(sub.permission));
    return submodules.length > 0 ? [{ ...module, submodules }] : [];
  });
}
