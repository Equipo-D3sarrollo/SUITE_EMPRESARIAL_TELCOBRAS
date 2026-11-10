import {
  Badge,
  Card,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusBadge,
} from '@telcobras/ui';
import { Activity, ChevronUp } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { averageLatencyMs, CONNECTORS, type ConnectorStatus, connectorsUp } from './connectors';

const dotColor: Record<ConnectorStatus, string> = {
  ok: 'bg-tb-verde',
  warning: 'bg-tb-amarillo',
  error: 'bg-tb-error',
};

/** Zona 4: barra fija de 48 px; al hacer clic despliega el detalle por conector (ADR-007). */
export function StatusBar() {
  return (
    <footer className="relative z-20 h-12 shrink-0 border-tb-gris/40 border-t bg-tb-blanco">
      <Popover>
        <PopoverTrigger className="group flex h-full w-full cursor-pointer items-center gap-5 px-4 text-left text-sm outline-tb-azul hover:bg-tb-gris/15 focus-visible:outline-2 focus-visible:-outline-offset-2">
          <Activity aria-hidden="true" className="size-4 shrink-0 text-tb-azul" />
          <span className="font-medium">{t.shell.status.title}</span>
          <span className="tabular-nums">
            {t.shell.status.latency}: <span className="font-semibold">{averageLatencyMs} ms</span>
          </span>
          <span className="tabular-nums">
            {t.shell.status.connectorsUp(connectorsUp, CONNECTORS.length)}
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
            {CONNECTORS.map((connector) => (
              <span key={connector.id} className="flex items-center gap-1.5 whitespace-nowrap">
                <span
                  aria-hidden="true"
                  className={cn('size-2 rounded-full', dotColor[connector.status])}
                />
                {t.connectors[connector.id].name}
                <span className="sr-only">: {t.shell.status.states[connector.status]}</span>
              </span>
            ))}
          </span>
          <ChevronUp
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          sideOffset={0}
          className="w-(--radix-popover-trigger-width) rounded-b-none p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-semibold text-sm">{t.shell.status.title}</h2>
            <Badge>{t.common.simulatedData}</Badge>
          </div>
          <ul className="grid grid-cols-5 gap-3">
            {CONNECTORS.map((connector) => (
              <li key={connector.id}>
                <Card className="flex h-full flex-col gap-1.5 p-3 shadow-none">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm">{t.connectors[connector.id].name}</span>
                    <StatusBadge status={connector.status}>
                      {t.shell.status.states[connector.status]}
                    </StatusBadge>
                  </div>
                  <span className="text-xs">{t.connectors[connector.id].description}</span>
                  <span className="text-xs tabular-nums">
                    {t.connectors.latency(connector.latencyMs)}
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </footer>
  );
}
