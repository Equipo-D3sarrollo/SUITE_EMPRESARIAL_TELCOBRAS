import {
  DATADIAN_BASE_PATH,
  DATADIAN_ROUTES,
  type DatadianResponse,
  type DatadianRouteId,
  datadianProblem,
  dianSettingsInputSchema,
  imapMailboxInputSchema,
  odooConnectionInputSchema,
  radianEventRequestSchema,
  radianInvoiceListQuerySchema,
  receivedDocumentDecisionSchema,
  syncRunRequestSchema,
} from '@telcobras/contracts';
import { HttpResponse, http, type JsonBodyType } from 'msw';
import type { z } from 'zod';
import { createMockDb, type MockDb, type MockDbOptions, MockError } from './db';

/**
 * Handlers MSW de DataDian (§4). Cada uno se registra con su entrada del catálogo de rutas y toda
 * respuesta pasa por el esquema zod de su ruta: un mock que no cumple el contrato falla.
 */
const pattern = (routeId: DatadianRouteId) =>
  `*${DATADIAN_BASE_PATH}${DATADIAN_ROUTES[routeId].path.replace(/\{(\w+)\}/g, ':$1')}`;

function respond<K extends DatadianRouteId>(routeId: K, data: DatadianResponse<K>) {
  const route = DATADIAN_ROUTES[routeId];
  const status = route.status;
  if (route.responseContentType === 'application/xml') {
    return new HttpResponse(String(data), {
      status,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
  const schema = 'response' in route ? (route.response as z.ZodType) : undefined;
  const body = (schema ? schema.parse(data) : data) as JsonBodyType;
  return HttpResponse.json(body, { status });
}

function problem(error: unknown) {
  if (error instanceof MockError) {
    if (error.code === 'NOT_FOUND' || error.code === 'BAD_REQUEST') {
      return HttpResponse.json(
        { type: 'about:blank', title: error.code, status: error.status },
        { status: error.status, headers: { 'Content-Type': 'application/problem+json' } },
      );
    }
    const body = datadianProblem(error.code, error.code);
    return HttpResponse.json(body, {
      status: body.status,
      headers: { 'Content-Type': 'application/problem+json' },
    });
  }
  throw error;
}

const badRequest = (detail: string) =>
  HttpResponse.json(
    { type: 'about:blank', title: 'Bad Request', status: 400, detail },
    { status: 400, headers: { 'Content-Type': 'application/problem+json' } },
  );

/** Ejecuta la acción del mock y traduce sus errores a problem+json. */
async function run(action: () => Response | Promise<Response>) {
  try {
    return await action();
  } catch (error) {
    return problem(error);
  }
}

const query = (request: Request) => Object.fromEntries(new URL(request.url).searchParams);
const param = (value: string | readonly string[] | undefined) => String(value ?? '');

export function createDatadianHandlers(db: MockDb) {
  return [
    http.get(pattern('E2'), () => run(() => respond('E2', db.summary()))),
    http.post(pattern('E27'), ({ request }) =>
      run(async () => {
        const form = await request.formData();
        const file = form.get('file');
        if (!(file instanceof File) || !/\.(xml|zip)$/i.test(file.name)) {
          return badRequest('Archivo inválido');
        }
        return respond('E27', db.requestSync({ channel: 'manual' }));
      }),
    ),
    http.get(pattern('E1'), ({ request }) =>
      run(() => {
        const parsed = radianInvoiceListQuerySchema.safeParse(query(request));
        if (!parsed.success) return badRequest(parsed.error.message);
        return respond('E1', db.list(parsed.data));
      }),
    ),
    http.get(pattern('E3'), ({ params }) => run(() => respond('E3', db.detail(param(params.id))))),
    http.get(pattern('E4'), ({ params }) => run(() => respond('E4', db.content(param(params.id))))),
    http.get(pattern('E5'), ({ params, request }) =>
      run(() => {
        const part = (query(request).part ?? 'invoice') as 'attached' | 'invoice' | 'validation';
        return respond('E5', db.xml(param(params.id), part));
      }),
    ),
    http.get(pattern('E6'), () =>
      HttpResponse.text('%PDF-1.4 ejemplo', { headers: { 'Content-Type': 'application/pdf' } }),
    ),
    http.get(pattern('E7'), ({ params }) => run(() => respond('E7', db.events(param(params.id))))),
    http.get(pattern('E9'), ({ params, request }) =>
      run(() => {
        const part = query(request).part === 'response' ? 'response' : 'request';
        return respond('E9', db.eventXml(param(params.id), param(params.eventId), part));
      }),
    ),
    http.get(pattern('E8'), ({ params }) =>
      run(() => respond('E8', db.eventDetail(param(params.id), param(params.eventId)))),
    ),
    http.post(pattern('E10'), ({ params, request }) =>
      run(async () => {
        const key = request.headers.get('Idempotency-Key');
        if (!key) return badRequest('Falta Idempotency-Key');
        const parsed = radianEventRequestSchema.safeParse(await request.json());
        if (!parsed.success) return badRequest(parsed.error.message);
        return respond('E10', db.requestEvent(param(params.id), parsed.data, key));
      }),
    ),
    http.get(pattern('E11'), () => run(() => respond('E11', db.rules()))),
    http.get(pattern('E12'), () => run(() => respond('E12', db.settings()))),
    http.put(pattern('E13'), ({ request }) =>
      run(async () => {
        const parsed = dianSettingsInputSchema.safeParse(await request.json());
        if (!parsed.success) return badRequest(parsed.error.message);
        return respond('E13', db.saveSettings(parsed.data));
      }),
    ),
    http.get(pattern('E14'), () => run(() => respond('E14', db.readiness()))),
    http.get(pattern('E15'), () => run(() => respond('E15', db.certificates()))),
    http.post(pattern('E16'), ({ request }) =>
      run(async () => {
        const form = await request.formData();
        const file = form.get('file');
        const password = form.get('password');
        if (!(file instanceof File) || typeof password !== 'string' || !password) {
          return badRequest('Faltan el archivo o la contraseña');
        }
        return respond('E16', await db.uploadCertificate(file));
      }),
    ),
    http.get(pattern('E17'), ({ params }) =>
      run(() => respond('E17', db.certificate(param(params.id)))),
    ),
    http.post(pattern('E18'), ({ params }) =>
      run(() => respond('E18', db.activateCertificate(param(params.id)))),
    ),
    http.post(pattern('E19'), ({ params }) =>
      run(() => respond('E19', db.retireCertificate(param(params.id)))),
    ),
    http.get(pattern('E20'), () => run(() => respond('E20', db.mailboxes()))),
    http.post(pattern('E21'), ({ request }) =>
      run(async () => {
        const parsed = imapMailboxInputSchema.safeParse(await request.json());
        if (!parsed.success) return badRequest(parsed.error.message);
        return respond('E21', db.saveMailbox(null, parsed.data));
      }),
    ),
    http.put(pattern('E22'), ({ params, request }) =>
      run(async () => {
        const parsed = imapMailboxInputSchema.safeParse(await request.json());
        if (!parsed.success) return badRequest(parsed.error.message);
        return respond('E22', db.saveMailbox(param(params.id), parsed.data));
      }),
    ),
    http.get(pattern('E23'), () => run(() => respond('E23', db.syncStatus()))),
    http.get(pattern('E24'), ({ request }) =>
      run(() => {
        const { cursor, limit } = query(request);
        return respond('E24', db.listRuns(cursor, Number(limit ?? 20)));
      }),
    ),
    http.get(pattern('E25'), ({ params }) =>
      run(() => respond('E25', db.runDetail(param(params.id)))),
    ),
    http.post(pattern('E26'), ({ request }) =>
      run(async () => {
        const parsed = syncRunRequestSchema.safeParse(await request.json());
        if (!parsed.success) return badRequest(parsed.error.message);
        return respond('E26', db.requestSync(parsed.data));
      }),
    ),
    http.get(pattern('E28'), ({ request }) =>
      run(() => respond('E28', db.jobs(query(request).status))),
    ),
    http.post(pattern('E29'), ({ params }) =>
      run(() => respond('E29', db.jobAction(param(params.id), 'retry'))),
    ),
    http.post(pattern('E30'), ({ params }) =>
      run(() => respond('E30', db.jobAction(param(params.id), 'cancel'))),
    ),
    http.get(pattern('E31'), () => run(() => respond('E31', db.health()))),
    // Heredadas.
    http.post(pattern('L1'), ({ params, request }) =>
      run(async () => {
        const parsed = receivedDocumentDecisionSchema.safeParse(await request.json());
        if (!parsed.success) return badRequest(parsed.error.message);
        const { decision, ...extra } = parsed.data;
        return respond('L1', db.decide(param(params.id), decision, extra));
      }),
    ),
    http.post(pattern('L2'), ({ params }) =>
      run(() => respond('L2', db.retryOdoo(param(params.id)))),
    ),
    http.get(pattern('L3'), ({ params }) => run(() => respond('L3', db.history(param(params.id))))),
    http.put(pattern('L4'), ({ request }) =>
      run(async () => {
        const parsed = odooConnectionInputSchema.safeParse(await request.json());
        if (!parsed.success) return badRequest(parsed.error.message);
        return respond('L4', db.saveOdoo(parsed.data));
      }),
    ),
    http.post(pattern('L5'), () => run(() => respond('L5', { ok: true }))),
  ];
}

export function createDatadianMocks(options: MockDbOptions = {}) {
  const db = createMockDb(options);
  return { db, handlers: createDatadianHandlers(db) };
}
