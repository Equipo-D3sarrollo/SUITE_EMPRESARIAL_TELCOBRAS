import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Card } from '@telcobras/ui';
import { ShieldAlert } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { healthQuery, settingsQuery } from '../api/queries';

const text = t.datadian.settings.certificate.banner;

/**
 * Aviso del certificado en todas las páginas de DataDian (§5.9): vence en 90 días o menos, venció o
 * no hay certificado activo. Usa GET /status, que también alimenta la Zona 4.
 */
export function CertificateBanner() {
  const health = useQuery(healthQuery);
  const settings = useQuery(settingsQuery);
  const dian = settings.data?.dian;
  const certificate = health.data?.certificate;
  if (!health.data || !settings.data) return null;

  let message: string | null = null;
  let error = false;
  if (dian && !dian.activeCertificateId) {
    message = text.missing;
    error = true;
  } else if (certificate?.expiryState === 'expired') {
    message = text.expired;
    error = true;
  } else if (certificate?.expiryState === 'due_soon' && certificate.daysToExpiry !== null) {
    message = text.due_soon(certificate.daysToExpiry);
  }
  if (!message) return null;

  return (
    <Card
      role="note"
      className={`flex flex-wrap items-center gap-2 p-3 text-sm ${error ? 'border-tb-error' : 'border-tb-amarillo'}`}
    >
      <ShieldAlert aria-hidden="true" className="size-4 shrink-0" />
      <span className="flex-1">{message}</span>
      <Link
        to="/app/$module/$submodule"
        params={{ module: 'documents', submodule: 'settings' }}
        className="font-medium text-tb-azul underline-offset-2 hover:underline"
      >
        {text.action}
      </Link>
    </Card>
  );
}
