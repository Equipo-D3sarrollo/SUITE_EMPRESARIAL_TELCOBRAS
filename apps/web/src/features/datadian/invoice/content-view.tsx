import { useQuery } from '@tanstack/react-query';
import type { InvoiceContent } from '@telcobras/contracts';
import { Card, CardContent, Skeleton } from '@telcobras/ui';
import { t } from '@/i18n/es-CO';
import { formatCop, formatDate, formatNit } from '@/lib/format-co';
import { problemCode } from '../api/client';
import { invoiceContentQuery } from '../api/queries';
import { formatDateTime } from '../shared/format';

const text = t.datadian.viewer;

const money = (value: string) => formatCop(Number(value));
const day = (value: string | null) => (value ? formatDate(`${value}T12:00:00-05:00`) : '—');

function Party({ title, party }: { title: string; party: InvoiceContent['supplier'] }) {
  const nit = party.nit ? `${party.nit}${party.nitDv ? `-${party.nitDv}` : ''}` : null;
  return (
    <div className="space-y-0.5 text-sm">
      <p className="font-semibold text-xs uppercase tracking-wide">{title}</p>
      <p className="font-medium">{party.name ?? '—'}</p>
      {nit && <p className="tabular-nums">NIT {formatNit(nit)}</p>}
      {party.address && <p>{[party.address, party.city].filter(Boolean).join(', ')}</p>}
      {party.email && <p>{party.email}</p>}
    </div>
  );
}

/**
 * Representación legible de la factura (§5.2.1): contenido normalizado por el servidor y dibujado en
 * React. Ningún texto del proveedor se inserta como HTML; no hay XSLT.
 */
export function ContentView({ invoiceId }: { invoiceId: string }) {
  const content = useQuery(invoiceContentQuery(invoiceId));

  if (content.isPending) return <Skeleton className="h-96 w-full" />;
  if (content.isError) {
    return (
      <Card className="p-4 text-sm">
        {problemCode(content.error) === 'API_XML_MISSING' ? text.xmlMissing : text.loadError}
      </Card>
    );
  }
  const data = content.data;
  const withholdings = data.taxes.filter((tax) => tax.isWithholding);
  const taxes = data.taxes.filter((tax) => !tax.isWithholding);

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Party title={text.supplier} party={data.supplier} />
          <Party title={text.buyer} party={data.buyer} />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
          <div>
            <dt className="font-medium">{text.number}</dt>
            <dd className="tabular-nums">{data.number ?? '—'}</dd>
          </div>
          <div>
            <dt className="font-medium">{text.issueDate}</dt>
            <dd className="tabular-nums">
              {day(data.issueDate)} {data.issueTime ?? ''}
            </dd>
          </div>
          <div>
            <dt className="font-medium">{text.dueDate}</dt>
            <dd className="tabular-nums">{day(data.dueDate)}</dd>
          </div>
          <div>
            <dt className="font-medium">{text.paymentForm}</dt>
            <dd>
              {data.paymentForm ? t.datadian.paymentForms[data.paymentForm] : '—'}
              {data.paymentMeansCode && ` · ${text.paymentMeans} ${data.paymentMeansCode}`}
            </dd>
          </div>
        </dl>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="mb-2 text-left font-semibold">{text.lines}</caption>
            <thead className="bg-tb-gris/10 text-xs uppercase">
              <tr>
                <th scope="col" className="px-2 py-1.5">
                  {text.line.no}
                </th>
                <th scope="col" className="px-2 py-1.5">
                  {text.line.description}
                </th>
                <th scope="col" className="px-2 py-1.5 text-right">
                  {text.line.quantity}
                </th>
                <th scope="col" className="px-2 py-1.5 text-right">
                  {text.line.unitPrice}
                </th>
                <th scope="col" className="px-2 py-1.5 text-right">
                  {text.line.tax}
                </th>
                <th scope="col" className="px-2 py-1.5 text-right">
                  {text.line.total}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map((line) => (
                <tr key={line.lineNo} className="border-tb-gris/30 border-t">
                  <td className="px-2 py-1.5 tabular-nums">{line.lineNo}</td>
                  <td className="px-2 py-1.5">{line.description}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">
                    {line.quantity} {line.unitCode ?? ''}
                  </td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{money(line.unitPrice)}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">
                    {line.taxPercent ? `${line.taxPercent} %` : '—'}
                  </td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{money(line.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3 text-sm">
            {taxes.length > 0 && (
              <div>
                <p className="font-semibold">{text.taxes}</p>
                <ul>
                  {taxes.map((tax) => (
                    <li key={`${tax.taxSchemeId}-${tax.percent}`} className="tabular-nums">
                      {tax.taxSchemeId} {tax.percent ? `${tax.percent} %` : ''} ·{' '}
                      {money(tax.taxAmount)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {withholdings.length > 0 && (
              <div>
                <p className="font-semibold">{text.withholdings}</p>
                <ul>
                  {withholdings.map((tax) => (
                    <li key={`${tax.taxSchemeId}-${tax.percent}`} className="tabular-nums">
                      {tax.taxSchemeId} {tax.percent ? `${tax.percent} %` : ''} ·{' '}
                      {money(tax.taxAmount)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="font-semibold">{text.dianValidation}</p>
              {data.dianValidation ? (
                <p>
                  {data.dianValidation.validatedAt &&
                    formatDateTime(data.dianValidation.validatedAt)}
                  {data.dianValidation.statusCode && ` · ${data.dianValidation.statusCode}`}
                  {data.dianValidation.statusDescription &&
                    ` · ${data.dianValidation.statusDescription}`}
                </p>
              ) : (
                <p>{text.noDianValidation}</p>
              )}
            </div>
            {data.notes.length > 0 && (
              <div>
                <p className="font-semibold">{text.notes}</p>
                {data.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            )}
          </div>
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 self-start text-sm">
            {(
              [
                'lineExtension',
                'allowances',
                'charges',
                'taxExclusive',
                'taxInclusive',
                'payable',
              ] as const
            ).map((key) => (
              <div key={key} className="contents">
                <dt className={key === 'payable' ? 'font-semibold' : undefined}>
                  {text.totals[key]}
                </dt>
                <dd
                  className={`text-right tabular-nums ${key === 'payable' ? 'font-semibold' : ''}`}
                >
                  {money(data.totals[key])}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
