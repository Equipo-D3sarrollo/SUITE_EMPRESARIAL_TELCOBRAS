import { useQuery } from '@tanstack/react-query';
import { CERTIFICATE_MAX_BYTES, type DianCertificate } from '@telcobras/contracts';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  Input,
  type Status,
  StatusBadge,
} from '@telcobras/ui';
import { Eye, EyeOff, LoaderCircle, Upload } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { formatDate } from '@/lib/format-co';
import {
  useActivateCertificate,
  useRetireCertificate,
  useUploadCertificate,
} from '../api/mutations';
import { certificatesQuery } from '../api/queries';
import { datadianErrorMessage } from '../shared/errors';

const text = t.datadian.settings.certificate;

const STATUS_TONE: Record<DianCertificate['status'], Status> = {
  pending_validation: 'info',
  valid: 'ok',
  invalid: 'error',
  retired: 'neutral',
};
const EXPIRY_TONE = { ok: 'ok', due_soon: 'warning', expired: 'error' } as const;
const CHECK_TONE = { pending: 'neutral', ok: 'ok', failed: 'error' } as const;

type Precheck = 'ok' | 'failed' | 'pending';

/** Validaciones previas visibles antes de enviar (§5.6). El navegador no abre el PKCS#12. */
export function certificatePrechecks(file: File | null, password: string) {
  const extension: Precheck = !file ? 'pending' : /\.(pfx|p12)$/i.test(file.name) ? 'ok' : 'failed';
  const size: Precheck = !file
    ? 'pending'
    : file.size > 0 && file.size <= CERTIFICATE_MAX_BYTES
      ? 'ok'
      : 'failed';
  const secret: Precheck = password.length > 0 ? 'ok' : 'pending';
  return { extension, size, password: secret };
}

function CertificateDetails({ certificate }: { certificate: DianCertificate }) {
  const day = (value: string | null) => (value ? formatDate(value) : '—');
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
      <dt className="font-medium">{text.subject}</dt>
      <dd className="break-words">{certificate.subjectDn ?? '—'}</dd>
      <dt className="font-medium">{text.subjectNit}</dt>
      <dd className="tabular-nums">{certificate.subjectNit ?? '—'}</dd>
      <dt className="font-medium">{text.issuer}</dt>
      <dd className="break-words">{certificate.issuerDn ?? '—'}</dd>
      <dt className="font-medium">{text.serial}</dt>
      <dd className="break-all font-mono text-xs">{certificate.serialNumber ?? '—'}</dd>
      <dt className="font-medium">{text.algorithm}</dt>
      <dd>{certificate.signatureAlgorithm ?? '—'}</dd>
      <dt className="font-medium">{text.validity}</dt>
      <dd className="tabular-nums">
        {text.validityRange(day(certificate.notBefore), day(certificate.notAfter))}
      </dd>
    </dl>
  );
}

function Checks({ certificate }: { certificate: DianCertificate }) {
  return (
    <div className="space-y-1.5">
      <p className="flex items-center gap-1.5 font-medium text-sm">
        {certificate.status === 'pending_validation' && (
          <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />
        )}
        {certificate.status === 'pending_validation' ? text.validating : text.telcoTitle}
      </p>
      <ul className="space-y-1 text-sm">
        {certificate.checks.map((check) => (
          <li key={check.check} className="flex flex-wrap items-center gap-2">
            <StatusBadge status={CHECK_TONE[check.status]}>
              {text.checkStatuses[check.status]}
            </StatusBadge>
            <span>{text.checks[check.check]}</span>
            {check.detail && <span className="w-full pl-1 text-xs">{check.detail}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Sección 2 de la configuración (§5.6): certificado activo con su vencimiento (alerta a 90 días),
 * carga con validaciones previas, validaciones de Telco (sondeo cada 3 s), activar, retirar e
 * historial. La contraseña y el archivo nunca vuelven al navegador.
 */
export function CertificateSection({
  activeCertificateId,
}: {
  activeCertificateId: string | null;
}) {
  const certificates = useQuery(certificatesQuery);
  const upload = useUploadCertificate();
  const activate = useActivateCertificate();
  const retire = useRetireCertificate();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const prechecks = certificatePrechecks(file, password);
  const ready = Object.values(prechecks).every((value) => value === 'ok');
  const active = certificates.data?.find((certificate) => certificate.id === activeCertificateId);
  const latest = certificates.data?.find((certificate) => certificate.id === upload.data?.id);
  const error = upload.error ?? activate.error ?? retire.error;

  return (
    <Card id="certificate">
      <CardHeader>
        <CardTitle asChild>
          <h2>{t.datadian.settings.sections.certificate}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section aria-labelledby="active-certificate" className="space-y-2">
          <h3 id="active-certificate" className="font-semibold text-sm">
            {text.active}
          </h3>
          {active ? (
            <>
              <div className="flex flex-wrap gap-2">
                {active.expiryState && (
                  <StatusBadge status={EXPIRY_TONE[active.expiryState]}>
                    {active.daysToExpiry === null
                      ? text.expiryStates[active.expiryState]
                      : text.daysToExpiry(active.daysToExpiry)}
                  </StatusBadge>
                )}
              </div>
              {active.expiryState === 'due_soon' && <p className="text-sm">{text.renew}</p>}
              <CertificateDetails certificate={active} />
            </>
          ) : (
            <p className="text-sm">{text.none}</p>
          )}
        </section>

        <form
          noValidate
          className="space-y-3 border-tb-gris/30 border-t pt-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!ready || !file) return;
            upload.mutate(
              { file, password },
              {
                onSuccess: () => {
                  setPassword('');
                  setFile(null);
                  (event.target as HTMLFormElement).reset();
                },
              },
            );
          }}
        >
          <h3 className="font-semibold text-sm">{text.upload}</h3>
          <Field label={text.file}>
            <Input
              type="file"
              accept=".pfx,.p12"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </Field>
          <div className="flex items-end gap-2">
            <Field label={text.password} className="flex-1">
              <Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="off"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              {showPassword ? text.hidePassword : text.showPassword}
            </Button>
          </div>
          <div>
            <p className="font-medium text-sm">{text.precheckTitle}</p>
            <ul className="space-y-1 text-sm">
              {(['extension', 'size', 'password'] as const).map((key) => (
                <li key={key} className="flex items-center gap-2">
                  <StatusBadge status={CHECK_TONE[prechecks[key]]}>
                    {text.precheckState[prechecks[key]]}
                  </StatusBadge>
                  {text.prechecks[key]}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs">{text.browserNote}</p>
          <Button type="submit" disabled={!ready || upload.isPending}>
            <Upload aria-hidden="true" />
            {text.submit}
          </Button>
        </form>

        {latest && latest.status !== 'retired' && !latest.isActive && (
          <Checks certificate={latest} />
        )}

        <div role="status" aria-live="polite" className="text-sm">
          {error && <p className="text-tb-error">{datadianErrorMessage(error)}</p>}
        </div>

        <section aria-labelledby="certificate-history" className="space-y-2">
          <h3 id="certificate-history" className="font-semibold text-sm">
            {text.history}
          </h3>
          <ul className="space-y-3">
            {certificates.data?.map((certificate) => (
              <li
                key={certificate.id}
                className="space-y-2 rounded-sm border border-tb-gris/40 p-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <StatusBadge status={STATUS_TONE[certificate.status]}>
                    {text.statuses[certificate.status]}
                  </StatusBadge>
                  {certificate.isActive && <StatusBadge status="info">{text.active}</StatusBadge>}
                  <span className="font-medium">
                    {certificate.subjectDn ?? certificate.pfxSha256.slice(0, 12)}
                  </span>
                  <span className="text-xs">{text.uploadedBy(certificate.uploadedBy.name)}</span>
                </div>
                {certificate.status !== 'valid' && <Checks certificate={certificate} />}
                <div className="flex gap-2">
                  {certificate.status === 'valid' && !certificate.isActive && (
                    <Button
                      size="sm"
                      disabled={activate.isPending}
                      onClick={() => activate.mutate(certificate.id)}
                    >
                      {text.activate}
                    </Button>
                  )}
                  {!certificate.isActive && certificate.status !== 'retired' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={retire.isPending}
                      onClick={() =>
                        window.confirm(text.retireConfirm) && retire.mutate(certificate.id)
                      }
                    >
                      {text.retire}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
