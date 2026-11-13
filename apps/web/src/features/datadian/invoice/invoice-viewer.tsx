import type { RadianInvoiceDetail } from '@telcobras/contracts';
import { Button, Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@telcobras/ui';
import { ArrowLeft, ExternalLink, TriangleAlert } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { t } from '@/i18n/es-CO';
import { formatCop, formatNit } from '@/lib/format-co';
import { invoiceLabel, pdfUrl } from '../api/queries';
import { RadianStatusBadge, ValidationBadge } from '../shared/badges';
import { CopyButton } from '../shared/copy-button';
import { shortHash } from '../shared/format';
import { ContentView } from './content-view';
import { XmlView } from './xml-view';

const text = t.datadian.viewer;
type View = 'content' | 'xml' | 'pdf';

/** Diferencias que el XML corrigió sobre el listado de la DIAN (`pre_xml_snapshot`). */
function SnapshotNotice({ snapshot }: { snapshot: Record<string, unknown> }) {
  const entries = Object.entries(snapshot);
  if (entries.length === 0) return null;
  return (
    <Card role="note" className="space-y-1 border-tb-amarillo p-3 text-sm">
      <p className="flex items-center gap-1.5 font-medium">
        <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
        {text.snapshotTitle}
      </p>
      <ul className="list-disc pl-5">
        {entries.map(([field, value]) => (
          <li key={field}>
            {text.snapshotField(text.snapshotFields[field] ?? field, String(value))}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/**
 * Visor documental de la Zona 2 (§5.2.1): encabezado con número, proveedor, total, validación del XML
 * y CUFE; pestañas Representación, XML y PDF, con la elegida en `?view=`.
 */
export function InvoiceViewer({
  invoice,
  view,
  onViewChange,
  onBack,
}: {
  invoice: RadianInvoiceDetail;
  view: View;
  onViewChange: (view: View) => void;
  onBack: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const label = invoiceLabel(invoice) || '—';

  // Al abrir una factura el foco va al encabezado del visor (§7).
  useEffect(() => {
    headingRef.current?.focus();
  }, [invoice.id]);

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft aria-hidden="true" />
        {text.back}
      </Button>

      <header className="space-y-2">
        <h2 ref={headingRef} tabIndex={-1} className="font-semibold text-xl outline-none">
          {label}
        </h2>
        <p className="text-sm">
          {invoice.issuerName ?? '—'}
          {invoice.issuerNit && (
            <span className="tabular-nums"> · NIT {formatNit(invoice.issuerNit)}</span>
          )}
          {invoice.total !== null && (
            <span className="font-semibold tabular-nums">
              {' '}
              · {formatCop(Number(invoice.total))}
            </span>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <RadianStatusBadge status={invoice.radianStatus} />
          <ValidationBadge status={invoice.validationStatus} errors={invoice.validationErrors} />
        </div>
        {invoice.validationErrors.length > 0 && (
          <div className="text-sm">
            <p className="font-medium">{text.validationErrors}</p>
            <ul className="list-disc pl-5">
              {invoice.validationErrors.map((error) => (
                <li key={error.code}>{text.validationCodes[error.code] ?? error.message}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium">{text.cufe}</span>
          <span className="font-mono" aria-hidden="true">
            {shortHash(invoice.cufe)}
          </span>
          <span className="sr-only">{invoice.cufe}</span>
          <CopyButton value={invoice.cufe} />
        </p>
      </header>

      {invoice.listingSnapshot && <SnapshotNotice snapshot={invoice.listingSnapshot} />}

      <Tabs value={view} onValueChange={(value) => onViewChange(value as View)}>
        <TabsList aria-label={text.tabsLabel}>
          <TabsTrigger value="content">{text.tabs.content}</TabsTrigger>
          <TabsTrigger value="xml">{text.tabs.xml}</TabsTrigger>
          <TabsTrigger value="pdf">{text.tabs.pdf}</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="pt-4">
          <ContentView invoiceId={invoice.id} />
        </TabsContent>
        <TabsContent value="xml" className="pt-4">
          {invoice.hasAttachedDocument ? (
            <XmlView invoiceId={invoice.id} fileName={label} />
          ) : (
            <Card className="p-4 text-sm">{text.xmlMissing}</Card>
          )}
        </TabsContent>
        <TabsContent value="pdf" className="pt-4">
          {invoice.pdf ? (
            <div className="space-y-2">
              <a
                href={pdfUrl(invoice.id)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 font-medium text-sm text-tb-azul underline-offset-2 hover:underline"
              >
                <ExternalLink aria-hidden="true" className="size-4" />
                {text.openPdf}
              </a>
              <iframe
                title={text.pdfTitle(label)}
                src={pdfUrl(invoice.id)}
                className="h-[70vh] w-full rounded-sm border border-tb-gris/40"
              />
            </div>
          ) : (
            <Card className="p-4 text-sm">{text.noPdf}</Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
