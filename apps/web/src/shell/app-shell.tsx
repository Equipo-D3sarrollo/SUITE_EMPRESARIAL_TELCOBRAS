import { Outlet } from '@tanstack/react-router';
import { t } from '@/i18n/es-CO';
import { useAllowedModules } from './navigation';
import { Topbar } from './zone0-topbar/topbar';
import { Sidebar } from './zone1-sidebar/sidebar';
import { StatusBar } from './zone4-status/status-bar';

const skipLink =
  'sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-tb-amarillo focus:px-3 focus:py-2 focus:font-medium focus:text-sm';

/**
 * Layout maestro de 5 zonas (documento madre §12.1): sin scroll global; cada zona tiene el suyo.
 * La ruta hija pinta las Zonas 2 y 3 (Workspace y ContextPanel) en el <Outlet />.
 */
export function AppShell() {
  const modules = useAllowedModules();
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <a href="#main-content" className={skipLink}>
        {t.shell.skipToContent}
      </a>
      <a href="#module-navigation" className={skipLink}>
        {t.shell.skipToNavigation}
      </a>
      <Topbar modules={modules} />
      <div className="flex min-h-0 flex-1">
        <Sidebar modules={modules} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <Outlet />
          </div>
          <StatusBar />
        </div>
      </div>
    </div>
  );
}
