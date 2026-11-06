import type { ModuleIcon, ModuleNode } from '@telcobras/contracts';
import {
  Bot,
  BriefcaseBusiness,
  ChartLine,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  Plug,
  Radar,
  Settings,
  Workflow,
} from 'lucide-react';

// Imports explícitos (no el mapa dinámico de lucide) para que el bundle lleve solo estos 10 iconos.
const ICONS: Record<ModuleIcon, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'briefcase-business': BriefcaseBusiness,
  radar: Radar,
  'file-text': FileText,
  plug: Plug,
  workflow: Workflow,
  bot: Bot,
  'chart-line': ChartLine,
  settings: Settings,
  'life-buoy': LifeBuoy,
};

export function moduleIcon(module: ModuleNode): LucideIcon {
  // ModuleNode tipa el icono como string; todos los nodos salen de NAVIGATION, así que es un ModuleIcon.
  return ICONS[module.icon as ModuleIcon];
}
