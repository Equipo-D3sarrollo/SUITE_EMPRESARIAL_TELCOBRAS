import { useQuery } from '@tanstack/react-query';
import type { DianListingFields, ReceivedDocument } from '@telcobras/contracts';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@telcobras/ui';
import { FileText } from 'lucide-react';
import { t } from '@/i18n/es-CO';
import { formatCop, formatDate } from '@/lib/format-co';
import { historyQuery, pdfUrl } from './api';
import { DocumentStatus, OdooStatus } from './document-status';

const text = t.datadian.detail;

// Orden de los 18 campos del listado de la DIAN (docs/etapas/ETAPA_2_DATADIAN.md §1.1).
const DIAN_FIELDS: readonly (keyof DianListingFields)[] = [
  'documentType',
  'cufe',
  'folio',
  'prefix',
  'paymentMethod',
  'issueDate',
  'issuerNit',
  'issuerName',
  'iva',
  'inc',
  'total',
  'dianStatus',
  'dianGroup',
  'costCenter',
  'paymentType',
  'acknowledgmentStatus',
  'invoiceReference',
  'observations',
];

const AMOUNTS = new Set<keyof DianListingFields>(['iva', 'inc', 'total']);

function fieldValue(document: ReceivedDocument, field: keyof DianListingFields): string {
  const value = document[field];
  if (value === null || value === '') return '—';
  if (AMOUNTS.has(field)) return formatCop(Number(value));
  if (field === 'issueDate') return formatDate(`${value}T12:00:00-05:00`);
  return value;
}

/** Zona 3 del tablero: los datos de la DIAN, el PDF, la decisión, Odoo y la trazabilidad. */
export function InvoiceDetail({ document }: { document: ReceivedDocument }) {
  const history = useQuery(historyQuery(document.id));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle asChild>
            <h2>{text.decisionTitle}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <DocumentStatus document={document} />
          {document.rejectionCode && (
            <p>
              <span className="font-medium">{text.rejectionCode}: </span>
              {t.datadian.rejectionCodes[document.rejectionCode]}
            </p>
          )}
          {document.decisionReason && (
            <p>
              <span className="font-medium">{text.note}: </span>
              {document.decisionReason}
            </p>
          )}
          {document.pdf ? (
            <a
              href={pdfUrl(document.id)}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 font-medium text-tb-azul underline-offset-2 hover:underline"
            >
              <FileText aria-hidden="true" className="size-4" />
              {text.openPdf}
            </a>
          ) : (
            <p>{text.noPdf}</p>
          )}
          {document.odoo && (
            <div className="space-y-1 border-tb-gris/30 border-t pt-3">
              <p className="font-medium">{text.odooTitle}</p>
              <OdooStatus odoo={document.odoo} />
              {document.odoo.moveId !== null && <p>{text.odooMove(document.odoo.moveId)}</p>}
              {document.odoo.error && <p className="text-tb-error">{document.odoo.error}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle asChild>
            <h2>{text.dianTitle}</h2>
          </CardTitle>
          <p className="text-xs">{text.dianNote}</p>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
            {DIAN_FIELDS.map((field) => (
              <div key={field} className="contents">
                <dt className="font-medium">{text.fields[field]}</dt>
                <dd className={field === 'cufe' ? 'break-all font-mono text-xs' : 'break-words'}>
                  {fieldValue(document, field)}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle asChild>
            <h2>{text.historyTitle}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.isPending ? (
            <Skeleton className="h-16 w-full" />
          ) : history.data && history.data.length > 0 ? (
            <ol className="space-y-2 text-sm">
              {history.data.map((entry) => (
                <li key={entry.id} className="border-tb-gris/40 border-l-2 pl-3">
                  <p className="font-medium">
                    {t.datadian.history[entry.action] ?? entry.action}
                    {entry.result !== 'success' && ` (${text.historyFailed})`}
                  </p>
                  <p className="text-xs tabular-nums">
                    {new Date(entry.createdAt).toLocaleString('es-CO', {
                      timeZone: 'America/Bogota',
                    })}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm">{text.historyEmpty}</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
