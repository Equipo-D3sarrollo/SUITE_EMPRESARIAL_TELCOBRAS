import { createServer, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';

export const FAKE_ODOO_API_KEY = 'fake-odoo-api-key-0123456789';

interface Call {
  model: string;
  method: string;
  body: Record<string, unknown>;
}

type Record_ = Record<string, unknown> & { id: number };

/**
 * Odoo de prueba que responde la API JSON-2 (POST /json/2/<modelo>/<método>) con lo mínimo que usa
 * DataDian. Guarda las llamadas para revisarlas y deja forzar fallas.
 */
export async function startFakeOdoo(partners: Record<string, number> = {}) {
  const calls: Call[] = [];
  const moves: Record_[] = [];
  const attachments: Record_[] = [];
  const failures = new Map<string, number>();
  let nextId = 100;

  const server = createServer(async (request, response) => {
    const send = (status: number, body: unknown) => {
      response.writeHead(status, { 'content-type': 'application/json' });
      response.end(JSON.stringify(body));
    };
    const match = /^\/json\/2\/([\w.]+)\/(\w+)$/.exec(request.url ?? '');
    if (request.method !== 'POST' || !match) return send(404, { message: 'Not found' });
    if (request.headers.authorization !== `bearer ${FAKE_ODOO_API_KEY}`) {
      return send(401, { name: 'werkzeug.exceptions.Unauthorized', message: 'Invalid apikey' });
    }
    const [, model = '', method = ''] = match;
    const body = JSON.parse(await readBody(request)) as Record<string, unknown>;
    calls.push({ model, method, body });

    const key = `${model}/${method}`;
    const pending = failures.get(key) ?? 0;
    if (pending > 0) {
      failures.set(key, pending - 1);
      return send(500, { name: 'odoo.exceptions.UserError', message: `Falla forzada en ${key}` });
    }

    const domain = (body.domain ?? []) as unknown[];
    const condition = (field: string) =>
      domain.find(
        (item): item is [string, string, unknown] => Array.isArray(item) && item[0] === field,
      )?.[2];
    const vals = ((body.vals_list ?? []) as Record<string, unknown>[])[0] ?? {};

    switch (key) {
      case 'res.users/context_get':
        return send(200, { lang: 'es_CO', tz: 'America/Bogota' });
      case 'res.partner/search': {
        const vat = String(condition('vat') ?? '');
        return send(200, partners[vat] === undefined ? [] : [partners[vat]]);
      }
      case 'account.move/search': {
        const cufe = String(condition('narration') ?? '');
        return send(
          200,
          moves.filter((move) => String(move.narration).includes(cufe)).map((move) => move.id),
        );
      }
      case 'account.move/create': {
        const id = nextId++;
        moves.push({ id, ...vals });
        return send(200, [id]);
      }
      case 'ir.attachment/search':
        return send(
          200,
          attachments
            .filter(
              (item) => item.res_id === condition('res_id') && item.name === condition('name'),
            )
            .map((item) => item.id),
        );
      case 'ir.attachment/create': {
        const id = nextId++;
        attachments.push({ id, ...vals });
        return send(200, [id]);
      }
      default:
        return send(404, { message: `Unknown method ${key}` });
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    calls,
    moves,
    attachments,
    /** La próxima vez (o las próximas n) que se llame a modelo/método, responde 500. */
    failNext: (key: string, times = 1) => failures.set(key, times),
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    request.setEncoding('utf8');
    request.on('data', (chunk: string) => {
      data += chunk;
    });
    request.on('end', () => resolve(data));
    request.on('error', reject);
  });
}
