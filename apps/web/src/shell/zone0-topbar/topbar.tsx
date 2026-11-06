import { Link } from '@tanstack/react-router';
import type { ModuleNode } from '@telcobras/contracts';
import { Badge, StatusBadge } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';
import { CONNECTORS, connectorsUp } from '../zone4-status/connectors';
import { CommandSearch } from './command-search';
import { Logo } from './logo';
import { NotificationsButton } from './notifications-button';
import { OrganizationSwitcher } from './organization-switcher';
import { UserMenu } from './user-menu';

const allServicesUp = connectorsUp === CONNECTORS.length;

/** Zona 0: barra superior de 56 px. */
export function Topbar({ modules }: { modules: readonly ModuleNode[] }) {
  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-4 border-tb-gris/40 border-b bg-tb-blanco px-4">
      <div className="flex w-56 shrink-0 items-center gap-2">
        <Link to="/app" className="rounded-sm outline-tb-azul focus-visible:outline-2">
          <Logo className="h-8" />
        </Link>
        <Badge className="border-tb-azul uppercase">{t.brand.suite}</Badge>
      </div>
      <OrganizationSwitcher />
      <div className="flex flex-1 justify-center">
        <CommandSearch modules={modules} />
      </div>
      <StatusBadge status={allServicesUp ? 'ok' : 'warning'}>
        {allServicesUp ? t.shell.servicesOperational : t.shell.servicesDegraded}
      </StatusBadge>
      <NotificationsButton />
      <UserMenu />
    </header>
  );
}
