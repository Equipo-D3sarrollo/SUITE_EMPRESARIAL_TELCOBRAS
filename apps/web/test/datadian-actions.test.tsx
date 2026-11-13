import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RadianStatus } from '@telcobras/contracts';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RadianActionsPanel } from '@/features/datadian/actions/radian-actions';
import { datadianRequest } from '@/features/datadian/api/client';
import { createDatadianMocks } from '@/features/datadian/mocks/handlers';

// Mocks MSW con la DIAN respondiendo al instante (latencia 0) para no depender del reloj.
let mocks = createDatadianMocks({ latencyMs: 0, certificateLatencyMs: 0 });
const server = setupServer();
const requests: { body: unknown; key: string | null }[] = [];

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(() => {
  mocks = createDatadianMocks({ latencyMs: 0, certificateLatencyMs: 0 });
  requests.length = 0;
  server.resetHandlers(...mocks.handlers);
  server.events.on('request:start', async ({ request }) => {
    if (request.method === 'POST') {
      requests.push({
        body: await request.clone().json(),
        key: request.headers.get('Idempotency-Key'),
      });
    }
  });
});
afterEach(() => server.events.removeAllListeners());

/** Una factura del mock en el estado pedido, válida, del ambiente configurado y sin escenario. */
function invoiceIn(status: RadianStatus, deadline?: 'open' | 'due_soon') {
  const record = [...mocks.db.invoices.values()].find((item) => {
    const view = mocks.db.detail(item.invoice.id);
    return (
      view.radianStatus === status &&
      view.validationStatus === 'valid' &&
      view.profileExecutionId === '2' &&
      view.paymentForm === '2' &&
      !item.scenario &&
      (!deadline || view.deadline.state === deadline)
    );
  });
  if (!record) throw new Error(`No hay factura ${status} en los mocks`);
  return mocks.db.detail(record.invoice.id);
}

function renderPanel(
  status: RadianStatus,
  canRequestEvents = true,
  deadline?: 'open' | 'due_soon',
) {
  const invoice = invoiceIn(status, deadline);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const notices: string[] = [];
  render(
    <QueryClientProvider client={queryClient}>
      <RadianActionsPanel
        invoice={invoice}
        events={mocks.db.events(invoice.id)}
        rules={mocks.db.rules()}
        settings={mocks.db.settings().dian}
        certificateValid
        canRequestEvents={canRequestEvents}
        onNotice={(message) => notices.push(message)}
      />
    </QueryClientProvider>,
  );
  return { invoice, notices };
}

const eventButtons = () =>
  screen
    .queryAllByRole('button')
    .map((button) => button.textContent ?? '')
    .filter((label) => /\(03\d\)/.test(label));

describe('DataDian: botones según la máquina de estados', () => {
  it.each<[RadianStatus, string[]]>([
    ['none', ['Acuse de recibo (030)']],
    ['acknowledged', ['Recibo del bien o servicio (032)']],
    ['goods_received', ['Aceptación expresa (033)', 'Reclamo (031)']],
    ['accepted_express', []],
    ['claimed', []],
  ])('estado %s muestra exactamente %j', (status, expected) => {
    renderPanel(status, true, status === 'goods_received' ? 'open' : undefined);
    expect(eventButtons()).toEqual(expected);
  });

  it('sin documents:events no hay botones y se avisa que es solo lectura', () => {
    renderPanel('none', false);
    expect(eventButtons()).toEqual([]);
    expect(screen.getByText(/Solo lectura/)).toBeVisible();
  });

  it('el 030 pide confirmación y envía el evento con su Idempotency-Key', async () => {
    const { invoice, notices } = renderPanel('none');
    fireEvent.click(screen.getByRole('button', { name: /Acuse de recibo \(030\)/ }));
    const dialog = await screen.findByRole('dialog', { name: /Confirmar/ });
    expect(within(dialog).getByText(/no se puede deshacer/)).toBeVisible();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Enviar a la DIAN' }));
    await waitFor(() => expect(requests).toHaveLength(1));
    expect(requests[0]).toMatchObject({ body: { eventCode: '030' } });
    expect(requests[0]?.key).toMatch(/^[0-9a-f-]{36}$/);
    await waitFor(() => expect(notices[0]).toMatch(/Se pidió el evento 030/));
    // Con latencia 0 la DIAN ya lo registró: la factura pasa al Estado 2.
    expect(mocks.db.detail(invoice.id).radianStatus).toBe('acknowledged');
  });

  it('un 409 DD001 se explica por su code y no cierra la confirmación', async () => {
    renderPanel('none');
    server.use(
      http.post('*/api/v1/documents/received/:id/events', () =>
        Response.json(
          {
            type: 'urn:telcobras:datadian:out-of-sequence',
            title: 'x',
            status: 409,
            code: 'DD001',
          },
          { status: 409, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: /Acuse de recibo \(030\)/ }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Enviar a la DIAN' }));
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(/Falta un evento previo/);
  });
});

describe('DataDian: mocks', () => {
  it('las lecturas de las pantallas cumplen su esquema (el cliente valida con zod)', async () => {
    const page = await datadianRequest('E1', { query: { limit: 100, from: '2000-01-01' } });
    expect(page.items.length).toBeGreaterThanOrEqual(30);
    const withXml = page.items.find((item) => item.hasAttachedDocument);
    if (!withXml) throw new Error('Sin facturas con XML');
    await Promise.all([
      datadianRequest('E2'),
      datadianRequest('E3', { params: { id: withXml.id } }),
      datadianRequest('E4', { params: { id: withXml.id } }),
      datadianRequest('E5', { params: { id: withXml.id }, query: { part: 'attached' } }),
      datadianRequest('E7', { params: { id: withXml.id } }),
      datadianRequest('E11'),
      datadianRequest('E12'),
      datadianRequest('E14'),
      datadianRequest('E15'),
      datadianRequest('E20'),
      datadianRequest('E23'),
      datadianRequest('E24', { query: { limit: 20 } }),
      datadianRequest('E28', { query: { status: 'dead', limit: 50 } }),
      datadianRequest('E31'),
    ]);
  });

  it('un pedido fuera de secuencia responde 409 DD001, como la base de datos', async () => {
    const invoice = invoiceIn('none');
    await expect(
      datadianRequest('E10', { params: { id: invoice.id }, body: { eventCode: '033' } }),
    ).rejects.toMatchObject({ status: 409, problem: { code: 'DD001' } });
  });
});

describe('DataDian: modal del reclamo 031', () => {
  it('no envía sin concepto y envía concepto y nota con una llave por intención', async () => {
    const { invoice } = renderPanel('goods_received', true, 'open');
    fireEvent.click(screen.getByRole('button', { name: /Reclamo \(031\)/ }));
    const dialog = await screen.findByRole('dialog', { name: 'Reclamo (031)' });
    const submit = within(dialog).getByRole('button', { name: 'Enviar reclamo a la DIAN' });
    expect(submit).toBeDisabled();
    expect(
      within(dialog).getByText(/detiene la conversión de la factura en título valor/),
    ).toBeVisible();

    fireEvent.click(
      within(dialog).getByRole('radio', { name: /02 · Mercancía no entregada totalmente/ }),
    );
    fireEvent.change(within(dialog).getByLabelText('Nota (opcional)'), {
      target: { value: 'Faltaron 3 cajas' },
    });
    expect(within(dialog).getByText('16 / 1000 caracteres')).toBeVisible();
    fireEvent.click(submit);

    await waitFor(() => expect(requests).toHaveLength(1));
    expect(requests[0]?.body).toEqual({
      eventCode: '031',
      claimCode: '02',
      claimNote: 'Faltaron 3 cajas',
    });
    await waitFor(() => expect(mocks.db.detail(invoice.id).radianStatus).toBe('claimed'));
  });
});
