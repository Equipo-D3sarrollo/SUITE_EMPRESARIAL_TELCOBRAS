import { Badge } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';

/** Los mocks MSW solo corren en desarrollo con VITE_DATADIAN_MOCKS=1 (§4.4). */
export const datadianMocksEnabled =
  import.meta.env.DEV && import.meta.env.VITE_DATADIAN_MOCKS === '1';

/** Avisa en el encabezado que los datos son simulados. */
export function MockBadge() {
  return datadianMocksEnabled ? <Badge>{t.datadian.mocks.badge}</Badge> : null;
}
