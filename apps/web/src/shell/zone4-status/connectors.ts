import { useQuery } from '@tanstack/react-query';
import type { DatadianHealth } from '@telcobras/contracts';
import type { t } from '@/i18n/es-CO';
import { ApiError } from '@/lib/api-client';
import { permissionsQuery } from '@/lib/queries';

type ConnectorId = Exclude<keyof typeof t.connectors, 'latency'>;
export type ConnectorStatus = 'ok' | 'warning' | 'error';

export type ConnectorHealth = {
  id: ConnectorId;
  status: ConnectorStatus;
  latencyMs: number;
  /** Viene de la API (no es telemetría simulada). */
  live?: boolean;
};

// shortcut: telemetría simulada (plan §1.3: la Zona 4 usa datos de ejemplo en la etapa 1).
// Se reemplaza por el estado real de cada conector cuando llegue el Integration Hub (etapa 10).
// RADIAN ya toma su estado de GET /api/v1/documents/status (DataDian §5.9) cuando el rol lo ve.
export const CONNECTORS: readonly ConnectorHealth[] = [
  { id: 'radian', status: 'ok', latencyMs: 34 },
  { id: 'odoo', status: 'ok', latencyMs: 12 },
  { id: 'whatsapp', status: 'ok', latencyMs: 21 },
  { id: 'leadgen', status: 'ok', latencyMs: 9 },
  { id: 'agents', status: 'ok', latencyMs: 14 },
];

/**
 * Estado de DataDian para la Zona 4. Sin zod a propósito: la barra va en el bundle inicial. Usa la
 * misma llave que `healthQuery` del feature, así las acciones de DataDian también la refrescan.
 */
const radianHealthQuery = {
  queryKey: ['datadian', 'health'] as const,
  queryFn: async ({ signal }: { signal: AbortSignal }): Promise<DatadianHealth> => {
    const response = await fetch('/api/v1/documents/status', { signal });
    if (!response.ok) throw new ApiError(response.status, undefined);
    return response.json();
  },
  refetchInterval: 60_000,
  staleTime: 30_000,
};

/** Conectores de la Zona 4: RADIAN real si el rol ve DataDian; los demás, simulados. */
export function useConnectors(): readonly ConnectorHealth[] {
  const permissions = useQuery(permissionsQuery);
  const canSeeRadian = permissions.data?.permissions.includes('documents:view') ?? false;
  const radian = useQuery({ ...radianHealthQuery, enabled: canSeeRadian });
  const health = radian.data;
  if (!health) return CONNECTORS;
  return CONNECTORS.map((connector) =>
    connector.id === 'radian'
      ? {
          ...connector,
          status: health.status,
          latencyMs: health.latencyMs ?? connector.latencyMs,
          live: true,
        }
      : connector,
  );
}

export const countUp = (connectors: readonly ConnectorHealth[]) =>
  connectors.filter((connector) => connector.status === 'ok').length;

export const averageLatency = (connectors: readonly ConnectorHealth[]) =>
  Math.round(
    connectors.reduce((sum, connector) => sum + connector.latencyMs, 0) / connectors.length,
  );
