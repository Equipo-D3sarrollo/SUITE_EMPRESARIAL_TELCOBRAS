import { Link } from '@tanstack/react-router';
import type { ModuleNode } from '@telcobras/contracts';
import { StatusBadge } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';
import { countUp, useConnectors } from '../zone4-status/connectors';
import { CommandSearch } from './command-search';
import { Logo } from './logo';
import { NotificationsButton } from './notifications-button';
import { OrganizationSwitcher } from './organization-switcher';
import { ThemeMenu } from './theme-menu';
import { UserMenu } from './user-menu';

/** Zona 0: barra superior de 56 px. */
export function Topbar({ modules }: { modules: readonly ModuleNode[] }) {
  const connectors = useConnectors();
  const allServicesUp = countUp(connectors) === connectors.length;
  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-4 border-tb-gris/40 border-b bg-tb-superficie px-4">
      <div className="flex w-56 shrink-0 items-center gap-2">
        <Link to="/app" className="rounded-sm outline-tb-azul focus-visible:outline-2">
          <Logo />
        </Link>
      </div>
      <OrganizationSwitcher />
      <div className="flex flex-1 justify-center">
        <CommandSearch modules={modules} />
      </div>
      <StatusBadge status={allServicesUp ? 'ok' : 'warning'}>
        {allServicesUp ? t.shell.servicesOperational : t.shell.servicesDegraded}
      </StatusBadge>
      <ThemeMenu />
      <NotificationsButton />
      <UserMenu />
    </header>
  );
}
