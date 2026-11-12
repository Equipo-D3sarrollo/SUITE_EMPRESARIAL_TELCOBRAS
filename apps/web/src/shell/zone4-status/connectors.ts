import type { t } from '@/i18n/es-CO';

type ConnectorId = Exclude<keyof typeof t.connectors, 'latency'>;
export type ConnectorStatus = 'ok' | 'warning' | 'error';

type ConnectorHealth = { id: ConnectorId; status: ConnectorStatus; latencyMs: number };

// shortcut: telemetría simulada (plan §1.3: la Zona 4 usa datos de ejemplo en la etapa 1).
// Se reemplaza por el estado real de cada conector cuando llegue el Integration Hub (etapa 10).
export const CONNECTORS: readonly ConnectorHealth[] = [
  { id: 'radian', status: 'ok', latencyMs: 34 },
  { id: 'odoo', status: 'ok', latencyMs: 12 },
  { id: 'whatsapp', status: 'ok', latencyMs: 21 },
  { id: 'leadgen', status: 'ok', latencyMs: 9 },
  { id: 'agents', status: 'ok', latencyMs: 14 },
];

export const connectorsUp = CONNECTORS.filter((connector) => connector.status === 'ok').length;

export const averageLatencyMs = Math.round(
  CONNECTORS.reduce((sum, connector) => sum + connector.latencyMs, 0) / CONNECTORS.length,
);
