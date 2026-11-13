import { useQuery } from '@tanstack/react-query';
import { Card, Skeleton, StatusBadge } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';
import { moduleLabel, submoduleLabel } from '@/shell/navigation';
import { Workspace } from '@/shell/zone2-workspace/workspace';
import { ContextPanel } from '@/shell/zone3-context/context-panel';
import { settingsQuery } from '../api/queries';
import { CertificateBanner } from '../shared/certificate-banner';
import { MockBadge } from '../shared/mock-badge';
import { CertificateSection } from './certificate-section';
import { DianSettingsForm } from './dian-form';
import { MailboxesSection } from './mailboxes-section';
import { OdooCard } from './odoo-card';

const text = t.datadian.settings;
const SECTIONS = ['dian', 'certificate', 'software', 'sync', 'mailboxes', 'odoo'] as const;

/**
 * Configuración de DataDian por organización (§5.6): datos DIAN, certificado, software y ambiente,
 * sincronización, buzones IMAP y Odoo (conservado). Índice lateral en la Zona 3.
 */
export function SettingsPage() {
  const settings = useQuery(settingsQuery);
  const dian = settings.data?.dian ?? null;

  return (
    <>
      <Workspace
        routeKey="documents/settings"
        eyebrow={
          <span className="flex items-center gap-2">
            {moduleLabel('documents')}
            <MockBadge />
          </span>
        }
        title={submoduleLabel('documents', 'settings')}
      >
        <CertificateBanner />
        {settings.isPending ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <div className="max-w-3xl space-y-6">
            <DianSettingsForm dian={dian} />
            <CertificateSection activeCertificateId={dian?.activeCertificateId ?? null} />
            <MailboxesSection />
            <OdooCard odoo={settings.data?.odoo ?? null} />
          </div>
        )}
      </Workspace>
      <ContextPanel routeKey="documents/settings">
        <Card className="space-y-3 p-4 text-sm">
          <nav aria-label={text.sections.label}>
            <p className="mb-2 font-semibold">{text.sections.label}</p>
            <ul className="space-y-1">
              {SECTIONS.map((section) => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    className="text-tb-azul underline-offset-2 hover:underline"
                  >
                    {text.sections[section]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Card>
        <Card className="space-y-2 p-4 text-sm">
          <p className="font-medium">{t.datadian.odooSettings.odooTitle}</p>
          {settings.data?.odoo ? (
            <StatusBadge status="ok">
              {t.datadian.odooSettings.configured(
                settings.data.odoo.baseUrl,
                settings.data.odoo.database,
              )}
            </StatusBadge>
          ) : (
            <StatusBadge status="warning">{t.datadian.odooSettings.notConfigured}</StatusBadge>
          )}
        </Card>
      </ContextPanel>
    </>
  );
}
