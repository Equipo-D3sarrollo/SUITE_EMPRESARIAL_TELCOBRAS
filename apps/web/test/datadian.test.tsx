import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Permission, ReceivedDocument, ReceivedDocumentSummary } from '@telcobras/contracts';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InvoicesPage } from '@/features/datadian/invoices-page';
import { permissionsQuery } from '@/lib/queries';

const get = vi.hoisted(() => vi.fn());
const post = vi.hoisted(() => vi.fn());

vi.mock('@/lib/api-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api-client')>();
  return { ...actual, api: { GET: get, POST: post } };
});

const ok = <T,>(data: T) => Promise.resolve({ data, response: { ok: true, status: 200 } });

const document = (overrides: Partial<ReceivedDocument>): ReceivedDocument => ({
  id: 'd1',
  importId: 'i1',
  documentType: 'Factura electrónica',
  cufe: 'a'.repeat(96),
  folio: '1172766070',
  prefix: 'R',
  paymentMethod: '1',
  issueDate: '2026-11-01',
  receivedAt: '2026-11-01T15:00:00.000Z',
  issuerNit: '800153993',
  issuerName: 'PROVEEDOR UNO S A S',
  iva: '12439.00',
  inc: '0.00',
  total: '77901.00',
  dianStatus: 'Aprobado con notificación',
  dianGroup: 'Recibido',
  costCenter: 'MEDIA COMERCE',
  paymentType: 'CREDITO',
  acknowledgmentStatus: null,
  invoiceReference: 'FACTU/2026/11/0001',
  observations: null,
  status: 'imported',
  decidedBy: null,
  decidedAt: null,
  decisionReason: null,
  rejectionCode: null,
  pdf: { fileName: 'R1172766070.pdf', uploadedAt: '2026-11-11T15:00:00.000Z', sizeBytes: 1000 },
  odoo: null,
  createdAt: '2026-11-11T15:00:00.000Z',
  ...overrides,
});

const withPdf = document({});
const withoutPdf = document({ id: 'd2', folio: '1172766071', cufe: 'b'.repeat(96), pdf: null });

const summary: ReceivedDocumentSummary = {
  byStatus: { imported: 2, draft: 0, approved: 0, rejected: 0 },
  odooFailed: 0,
  pendingTotal: '155802.00',
};

// Lo que "tiene" la API: las decisiones simuladas reemplazan la factura, como lo haría el servidor.
let items: ReceivedDocument[] = [];

/** La API responde la decisión con la factura actualizada y la deja así en el listado. */
function decisionReturns(updated: ReceivedDocument) {
  post.mockImplementation(() => {
    items = items.map((item) => (item.id === updated.id ? updated : item));
    return ok(updated);
  });
}

function renderPage(permissions: Permission[], odooConfigured = true) {
  items = [withPdf, withoutPdf];
  get.mockImplementation((path: string) => {
    if (path === '/api/v1/documents/received') return ok({ items, nextCursor: null });
    if (path === '/api/v1/documents/received/summary') return ok(summary);
    if (path === '/api/v1/documents/settings') {
      return ok({
        odoo: odooConfigured
          ? { baseUrl: 'https://x.odoo.com', database: 'x', updatedAt: '2026-11-11T00:00:00Z' }
          : null,
      });
    }
    if (path === '/api/v1/documents/received/{id}/history') return ok([]);
    throw new Error(`Unexpected GET ${path}`);
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(permissionsQuery.queryKey, { permissions });
  render(
    <QueryClientProvider client={queryClient}>
      <InvoicesPage />
    </QueryClientProvider>,
  );
}

const rowOf = async (invoice: string) =>
  (await screen.findByRole('button', { name: invoice })).closest('tr') as HTMLElement;

beforeEach(() => {
  get.mockReset();
  post.mockReset();
});

describe('DataDian: tablero de facturas', () => {
  it('muestra cifras y facturas, y deja aprobar con o sin PDF', async () => {
    renderPage(['documents:view', 'documents:decide']);

    const pendingKpi = await screen.findByRole('group', { name: 'Pendientes' });
    await waitFor(() => expect(pendingKpi).toHaveTextContent('2'));
    expect(screen.queryByRole('group', { name: 'Sin PDF' })).toBeNull();
    for (const invoice of ['R1172766070', 'R1172766071']) {
      expect(within(await rowOf(invoice)).getByRole('button', { name: 'Aprobar' })).toBeEnabled();
    }
  });

  it('el detalle muestra la fecha de recepción y el PDF solo si la factura lo tiene', async () => {
    renderPage(['documents:view']);

    fireEvent.click(await screen.findByRole('button', { name: 'R1172766071' }));
    expect(await screen.findByText('Fecha de recepción')).toBeVisible();
    expect(screen.getByText('Esta factura no tiene PDF.')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'R1172766070' }));
    expect(await screen.findByRole('link', { name: 'Ver PDF' })).toHaveAttribute(
      'href',
      '/api/v1/documents/received/d1/pdf',
    );
  });

  it('aprobar envía la decisión y avisa que la factura quedó en Odoo', async () => {
    renderPage(['documents:view', 'documents:decide']);
    decisionReturns(
      document({
        status: 'approved',
        odoo: { status: 'sent', moveId: 41, error: null, sentAt: '2026-11-11T15:01:00Z' },
      }),
    );

    fireEvent.click(within(await rowOf('R1172766070')).getByRole('button', { name: 'Aprobar' }));

    await waitFor(() =>
      expect(post).toHaveBeenCalledWith('/api/v1/documents/received/{id}/decision', {
        params: { path: { id: 'd1' } },
        body: { decision: 'approved' },
      }),
    );
    expect(
      await screen.findByText('La factura R1172766070 quedó aprobada y en Odoo.'),
    ).toBeVisible();
    expect(await screen.findByText('Factura de proveedor #41 en borrador')).toBeVisible();
  });

  it('borrador guarda la factura para aprobarla después', async () => {
    renderPage(['documents:view', 'documents:decide']);
    decisionReturns(document({ status: 'draft' }));

    fireEvent.click(within(await rowOf('R1172766070')).getByRole('button', { name: 'Borrador' }));

    await waitFor(() =>
      expect(post).toHaveBeenCalledWith('/api/v1/documents/received/{id}/decision', {
        params: { path: { id: 'd1' } },
        body: { decision: 'draft' },
      }),
    );
    expect(await screen.findByText('La factura R1172766070 quedó en borrador.')).toBeVisible();
  });

  it('rechazar exige el motivo de reclamo de la DIAN', async () => {
    renderPage(['documents:view', 'documents:decide']);
    decisionReturns(document({ status: 'rejected', rejectionCode: '04' }));

    fireEvent.click(within(await rowOf('R1172766070')).getByRole('button', { name: 'Rechazar' }));
    const dialog = await screen.findByRole('dialog', { name: 'Rechazar factura' });
    const submit = within(dialog).getByRole('button', { name: 'Rechazar factura' });
    expect(submit).toBeDisabled();

    fireEvent.change(within(dialog).getByLabelText('Motivo de reclamo'), {
      target: { value: '04' },
    });
    fireEvent.click(submit);

    await waitFor(() =>
      expect(post).toHaveBeenCalledWith('/api/v1/documents/received/{id}/decision', {
        params: { path: { id: 'd1' } },
        body: { decision: 'rejected', rejectionCode: '04', reason: undefined },
      }),
    );
  });

  it('sin conexión con Odoo avisa y no deja aprobar; sin permiso de decidir no hay acciones', async () => {
    renderPage(['documents:view', 'documents:decide'], false);
    expect(await screen.findByText(/configure primero la conexión con Odoo/)).toBeVisible();
    expect(
      within(await rowOf('R1172766070')).getByRole('button', { name: 'Aprobar' }),
    ).toBeDisabled();
  });

  it('un rol que solo ve DataDian no tiene botones de decisión', async () => {
    renderPage(['documents:view']);
    const row = await rowOf('R1172766070');
    expect(within(row).queryByRole('button', { name: 'Aprobar' })).toBeNull();
    expect(within(row).queryByRole('button', { name: 'Rechazar' })).toBeNull();
  });
});
