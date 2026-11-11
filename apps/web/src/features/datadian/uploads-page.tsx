import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReceivedDocumentImportSummary } from '@telcobras/contracts';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
} from '@telcobras/ui';
import { FileSpreadsheet, FileUp } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { t } from '@/i18n/es-CO';
import { moduleLabel, submoduleLabel } from '@/shell/navigation';
import { Workspace } from '@/shell/zone2-workspace/workspace';
import { ContextPanel } from '@/shell/zone3-context/context-panel';
import { DATADIAN_KEY, errorMessage, uploadListing, uploadPdf } from './api';

const text = t.datadian.uploads;

type PdfResult = { name: string; ok: boolean; message: string };

/** Carga de documentos de la DIAN: primero el listado en Excel, después los PDF de cada factura. */
export function UploadsPage() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: DATADIAN_KEY });

  const listingInput = useRef<HTMLInputElement>(null);
  const pdfInput = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<ReceivedDocumentImportSummary | null>(null);
  const [pdfResults, setPdfResults] = useState<PdfResult[]>([]);
  const [pdfProgress, setPdfProgress] = useState<{ done: number; total: number } | null>(null);

  const listing = useMutation({
    mutationFn: uploadListing,
    onSuccess: setSummary,
    onSettled: refresh,
  });

  // Los PDF se cargan uno por uno: cada uno se abre con el NIT y se asocia con su factura en la API.
  const pdfs = useMutation({
    mutationFn: async (files: File[]) => {
      const results: PdfResult[] = [];
      setPdfResults([]);
      for (const [index, file] of files.entries()) {
        setPdfProgress({ done: index, total: files.length });
        try {
          const uploaded = await uploadPdf(file);
          results.push({ name: file.name, ok: true, message: text.pdfOk(uploaded.cufe) });
        } catch (error) {
          results.push({ name: file.name, ok: false, message: errorMessage(error, text.error) });
        }
        setPdfResults([...results]);
      }
      setPdfProgress({ done: files.length, total: files.length });
    },
    onSettled: refresh,
  });

  const pickListing = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) listing.mutate(file);
  };

  const pickPdfs = (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    if (files.length > 0) pdfs.mutate(files);
  };

  return (
    <>
      <Workspace
        routeKey="documents/uploads"
        eyebrow={moduleLabel('documents')}
        title={submoduleLabel('documents', 'uploads')}
      >
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>{text.listingTitle}</h2>
            </CardTitle>
            <CardDescription>{text.listingDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              ref={listingInput}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={pickListing}
            />
            <Button disabled={listing.isPending} onClick={() => listingInput.current?.click()}>
              <FileSpreadsheet aria-hidden="true" />
              {listing.isPending ? text.uploading : text.listingButton}
            </Button>
            <div role="status" aria-live="polite" className="space-y-2 text-sm">
              {listing.isError && (
                <p className="text-tb-error">{errorMessage(listing.error, text.error)}</p>
              )}
              {summary && (
                <>
                  <p className="font-medium">
                    {summary.fileName}:{' '}
                    {text.listingResult(
                      summary.created,
                      summary.alreadyExisting,
                      summary.rejected.length,
                    )}
                  </p>
                  {summary.rejected.length > 0 && (
                    <ul className="list-disc space-y-0.5 pl-5">
                      {summary.rejected.map((row) => (
                        <li key={row.row}>{text.rejectedRow(row.row, row.reason)}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h2>{text.pdfTitle}</h2>
            </CardTitle>
            <CardDescription>{text.pdfDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              ref={pdfInput}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={pickPdfs}
            />
            <Button disabled={pdfs.isPending} onClick={() => pdfInput.current?.click()}>
              <FileUp aria-hidden="true" />
              {pdfs.isPending ? text.uploading : text.pdfButton}
            </Button>
            <div role="status" aria-live="polite" className="space-y-2 text-sm">
              {pdfProgress && <p>{text.pdfProgress(pdfProgress.done, pdfProgress.total)}</p>}
              {pdfResults.length > 0 && (
                <ul className="space-y-1.5">
                  {pdfResults.map((result, index) => (
                    <li key={index} className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={result.ok ? 'ok' : 'error'}>{result.name}</StatusBadge>
                      <span>{result.message}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </Workspace>
      <ContextPanel routeKey="documents/uploads">
        <Card className="space-y-2 p-4 text-sm">
          <p className="font-medium">{t.datadian.settings.pdfTitle}</p>
          <p>{t.datadian.settings.pdfDescription}</p>
        </Card>
      </ContextPanel>
    </>
  );
}
