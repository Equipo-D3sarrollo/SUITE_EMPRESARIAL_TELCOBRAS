import { Button, EmptyState, Popover, PopoverContent, PopoverTrigger } from '@telcobras/ui';
import { Bell } from 'lucide-react';
import { t } from '@/i18n/es-CO';

/** Campana de la Zona 0. Las notificaciones internas llegan en la etapa 9 (documento madre §4.8). */
export function NotificationsButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.shell.notifications.label}>
          <Bell aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <EmptyState
          icon={Bell}
          title={t.shell.notifications.emptyTitle}
          description={t.shell.notifications.emptyDescription}
        />
      </PopoverContent>
    </Popover>
  );
}
