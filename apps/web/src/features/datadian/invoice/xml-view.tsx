import { useQuery } from '@tanstack/react-query';
import { INVOICE_XML_PARTS } from '@telcobras/contracts';
import { Button, Card, Field, Select, Skeleton } from '@telcobras/ui';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n/es-CO';
import { invoiceContentQuery, invoiceXmlQuery } from '../api/queries';
import { CopyButton } from '../shared/copy-button';

const text = t.datadian.viewer;
type Part = (typeof INVOICE_XML_PARTS)[number];

/** Indentación solo de presentación: lo descargado es el original, byte a byte. */
function indent(xml: string): string {
  let depth = 0;
  return xml
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map((line) => {
      if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
      const padded = `${'  '.repeat(depth)}${line}`;
      if (/^<[^!?/][^>]*[^/]>$/.test(line) && !/<\/[^>]+>$/.test(line)) depth++;
      return padded;
    })
    .join('\n');
}

function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/xml' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/** Pestaña XML del visor: texto de solo lectura, con copiar, descargar y el SHA-256 del original. */
export function XmlView({ invoiceId, fileName }: { invoiceId: string; fileName: string }) {
  const [part, setPart] = useState<Part>('invoice');
  const sha256 = useQuery(invoiceContentQuery(invoiceId)).data?.xmlSha256 ?? null;
  const xml = useQuery(invoiceXmlQuery(invoiceId, part));

  return (
    <Card className="space-y-3 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label={text.xmlPart} className="w-56">
          <Select value={part} onChange={(event) => setPart(event.target.value as Part)}>
            {INVOICE_XML_PARTS.map((option) => (
              <option key={option} value={option}>
                {text.xmlParts[option]}
              </option>
            ))}
          </Select>
        </Field>
        {xml.data && (
          <>
            <CopyButton value={xml.data} />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => download(`${fileName}-${part}.xml`, xml.data)}
            >
              <Download aria-hidden="true" />
              {text.download}
            </Button>
          </>
        )}
      </div>
      {sha256 && part === 'attached' && (
        <p className="break-all font-mono text-xs">{text.sha256(sha256)}</p>
      )}
      {xml.isPending ? (
        <Skeleton className="h-80 w-full" />
      ) : xml.isError ? (
        <p className="text-sm">{text.loadError}</p>
      ) : (
        <pre
          // biome-ignore lint/a11y/noNoninteractiveTabindex: el bloque se desplaza con teclado (§7).
          tabIndex={0}
          className="max-h-[60vh] overflow-auto rounded-sm bg-tb-gris/10 p-3 font-mono text-xs outline-tb-azul focus-visible:outline-2"
        >
          {indent(xml.data)}
        </pre>
      )}
    </Card>
  );
}
