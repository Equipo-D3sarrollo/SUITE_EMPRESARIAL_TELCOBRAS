import { unzipSync } from 'fflate';
import { parse as parseHtml } from 'node-html-parser';

/**
 * Cliente del catálogo de factura electrónica de la DIAN (catalogo-vpfe.dian.gov.co), con el flujo
 * que hace una persona en el navegador y que replica el extractor de FacturaLatam:
 *
 *   1. GET  /User/AuthToken?…token=…   (el enlace del correo) → cookie de sesión, válida ~14 días.
 *   2. GET  /Document/Export             → formulario con el token anti-falsificación.
 *   3. POST /Document/Export             → encola la exportación del listado (responde "true").
 *   4. POST /Document/TasksPartial       → tabla de tareas; se sondea hasta que la nuestra esté "Listo".
 *   5. GET  /Document/DownloadExportedZipFile?pk=NIT&rk=ID → 302 a un ZIP con el Excel.
 *
 * El ritmo de sondeo es el del propio portal (entre 10 y 30 segundos). Si el portal bloquea la sesión
 * ("Solicitud bloqueada por controles de seguridad") se informa y no se insiste.
 */

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0';
const EXPORT_MAX_DOCUMENTS = '150000';
const GROUP_RECEIVED = '2';
const MAX_REDIRECTS = 5;
const DEFAULT_MAX_WAIT_MS = 15 * 60_000;

export type DianPortalErrorCode =
  | 'invalid_token'
  | 'session_expired'
  | 'blocked'
  | 'export_rejected'
  | 'export_failed'
  | 'export_timeout'
  | 'portal';

export class DianPortalError extends Error {
  constructor(
    readonly code: DianPortalErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DianPortalError';
  }
}

export interface DianCookie {
  name: string;
  value: string;
  /** Fecha ISO de vencimiento, si el portal la indicó. */
  expires?: string;
}

/** Cookies de la sesión del portal: lo único que hay que guardar para volver a entrar. */
export class DianCookieJar {
  private readonly cookies = new Map<string, DianCookie>();

  constructor(cookies: readonly DianCookie[] = []) {
    for (const cookie of cookies) this.cookies.set(cookie.name, cookie);
  }

  absorb(setCookieHeaders: readonly string[]): void {
    for (const header of setCookieHeaders) {
      const [pair = '', ...attributes] = header.split(';');
      const separator = pair.indexOf('=');
      if (separator < 0) continue;
      const name = pair.slice(0, separator).trim();
      const value = pair.slice(separator + 1).trim();
      const expiresAttribute = attributes
        .map((attribute) => attribute.trim())
        .find((attribute) => attribute.toLowerCase().startsWith('expires='));
      const expires = expiresAttribute ? new Date(expiresAttribute.slice(8)) : undefined;
      // Un valor vacío o un vencimiento en el pasado es la forma de borrar la cookie.
      if (value === '' || (expires && expires.getTime() < Date.now())) {
        this.cookies.delete(name);
        continue;
      }
      this.cookies.set(name, {
        name,
        value,
        ...(expires && !Number.isNaN(expires.getTime()) ? { expires: expires.toISOString() } : {}),
      });
    }
  }

  header(): string {
    return [...this.cookies.values()].map(({ name, value }) => `${name}=${value}`).join('; ');
  }

  get(name: string): DianCookie | undefined {
    return this.cookies.get(name);
  }

  toJSON(): DianCookie[] {
    return [...this.cookies.values()];
  }
}

export interface ExportTask {
  /** Rango exportado, como fechas ISO. */
  startDate: string;
  endDate: string;
  group: string;
  total: number | null;
  status: 'processing' | 'ready' | 'failed';
  /** Ruta de descarga (relativa al portal) cuando está lista. */
  downloadPath: string | null;
}

export interface DianPortalClientOptions {
  fetch?: typeof fetch;
  /** Milisegundos entre sondeos de la exportación. */
  pollIntervalMs?: () => number;
  maxWaitMs?: number;
}

export interface DianLogin {
  client: DianPortalClient;
  host: string;
  /** NIT que viene en el enlace del token (parámetro rk). */
  nit: string;
  expiresAt: Date | null;
}

export class DianPortalClient {
  private readonly fetch: typeof fetch;
  private readonly pollIntervalMs: () => number;
  private readonly maxWaitMs: number;

  constructor(
    readonly origin: string,
    readonly jar: DianCookieJar,
    options: DianPortalClientOptions = {},
  ) {
    this.fetch = options.fetch ?? globalThis.fetch;
    this.pollIntervalMs = options.pollIntervalMs ?? (() => 10_000 + Math.random() * 10_000);
    this.maxWaitMs = options.maxWaitMs ?? DEFAULT_MAX_WAIT_MS;
  }

  /** Entra con el enlace del correo "Token acceso DIAN" y devuelve la sesión abierta. */
  static async loginWithTokenLink(
    tokenLink: string,
    options: DianPortalClientOptions = {},
  ): Promise<DianLogin> {
    const url = new URL(tokenLink);
    const client = new DianPortalClient(url.origin, new DianCookieJar(), options);
    const landing = await client.request(url.pathname + url.search, { followRedirects: true });
    const html = await landing.text();
    if (!client.jar.get('.AspNet.ApplicationCookie')) {
      throw new DianPortalError(
        'invalid_token',
        'La DIAN no aceptó el enlace: pida un token nuevo desde el portal y pegue el enlace completo',
      );
    }
    assertNotBlocked(html);
    if (!(await client.isAuthenticated())) {
      throw new DianPortalError('invalid_token', 'La DIAN no abrió la sesión con ese enlace');
    }
    const expires = client.jar.get('.AspNet.ApplicationCookie')?.expires;
    return {
      client,
      host: url.hostname,
      nit: url.searchParams.get('rk') ?? '',
      expiresAt: expires ? new Date(expires) : null,
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const response = await this.request('/Home/GetEmittedAndreceivedTotal', {
      method: 'POST',
      ajax: true,
      body: '',
    });
    const text = await response.text();
    assertNotBlocked(text);
    if (!response.ok) return false;
    try {
      const body = JSON.parse(text) as { authenticated?: boolean };
      return body.authenticated === true;
    } catch {
      return false;
    }
  }

  /** Encola la exportación a Excel del listado de recibidos del rango (fechas ISO). */
  async requestExport(startDate: string, endDate: string): Promise<void> {
    const token = await this.antiForgeryToken();
    const response = await this.request('/Document/Export', {
      method: 'POST',
      ajax: true,
      body: new URLSearchParams({
        __RequestVerificationToken: token,
        Type: '0',
        StartDate: startDate,
        EndDate: endDate,
        AmountAdmin: EXPORT_MAX_DOCUMENTS,
        ReceiverCode: '',
        GroupCode: GROUP_RECEIVED,
      }).toString(),
    });
    const text = (await response.text()).trim();
    if (!response.ok || text !== 'true') {
      throw new DianPortalError(
        'export_rejected',
        `El portal no aceptó la exportación (${response.status}: ${text.slice(0, 120)})`,
      );
    }
  }

  async listExportTasks(): Promise<ExportTask[]> {
    const token = await this.antiForgeryToken();
    const response = await this.request('/Document/TasksPartial', {
      method: 'POST',
      ajax: true,
      body: new URLSearchParams({ __RequestVerificationToken: token }).toString(),
    });
    const html = await response.text();
    if (!response.ok) {
      throw new DianPortalError('portal', `El portal respondió ${response.status} al consultar las tareas`);
    }
    return parseExportTasks(html);
  }

  /** Sondea hasta que la exportación del rango esté lista; la más reciente del rango es la nuestra. */
  async waitForExport(
    startDate: string,
    endDate: string,
    onPoll?: (task: ExportTask | null) => void,
  ): Promise<ExportTask> {
    const deadline = Date.now() + this.maxWaitMs;
    while (Date.now() < deadline) {
      await sleep(this.pollIntervalMs());
      const tasks = await this.listExportTasks();
      const task =
        tasks.find(
          (item) =>
            item.startDate === startDate && item.endDate === endDate && item.group === 'Recibidos',
        ) ?? null;
      onPoll?.(task);
      if (!task) continue;
      if (task.status === 'ready' && task.downloadPath) return task;
      if (task.status === 'failed') {
        throw new DianPortalError('export_failed', 'El portal marcó la exportación como fallida');
      }
    }
    throw new DianPortalError(
      'export_timeout',
      'El portal no terminó la exportación en el tiempo esperado; intente de nuevo más tarde',
    );
  }

  /** Descarga el ZIP de una exportación lista y devuelve el Excel que contiene. */
  async downloadExport(task: ExportTask): Promise<Buffer> {
    if (!task.downloadPath) throw new DianPortalError('portal', 'La exportación no tiene descarga');
    const redirect = await this.request(task.downloadPath, { followRedirects: false });
    const location = redirect.headers.get('location');
    if (redirect.status < 300 || redirect.status >= 400 || !location) {
      throw new DianPortalError('portal', `El portal no entregó el archivo (${redirect.status})`);
    }
    // El ZIP vive en el almacenamiento de la DIAN con una firma temporal: sin cookies del portal.
    const file = await this.fetch(new URL(location, this.origin), {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(120_000),
    });
    if (!file.ok) throw new DianPortalError('portal', `No se pudo descargar el ZIP (${file.status})`);
    const zip = new Uint8Array(await file.arrayBuffer());
    let entries: Record<string, Uint8Array>;
    try {
      entries = unzipSync(zip);
    } catch {
      throw new DianPortalError('portal', 'El archivo descargado no es un ZIP válido');
    }
    const xlsx = Object.entries(entries).find(([name]) => name.toLowerCase().endsWith('.xlsx'));
    if (!xlsx) throw new DianPortalError('portal', 'El ZIP de la DIAN no trae un Excel');
    return Buffer.from(xlsx[1]);
  }

  private async antiForgeryToken(): Promise<string> {
    const response = await this.request('/Document/Export', { followRedirects: false });
    if (response.status >= 300 && response.status < 400) {
      throw new DianPortalError('session_expired', 'La sesión con la DIAN venció: pida un token nuevo');
    }
    const html = await response.text();
    assertNotBlocked(html);
    const token = parseHtml(html)
      .querySelector('#export-form input[name="__RequestVerificationToken"]')
      ?.getAttribute('value');
    if (!token) {
      throw new DianPortalError('session_expired', 'La sesión con la DIAN venció: pida un token nuevo');
    }
    return token;
  }

  private async request(
    path: string,
    options: {
      method?: 'GET' | 'POST';
      body?: string;
      ajax?: boolean;
      followRedirects?: boolean;
    } = {},
  ): Promise<Response> {
    let url = new URL(path, this.origin);
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const headers: Record<string, string> = {
        'User-Agent': USER_AGENT,
        Accept: options.ajax ? '*/*' : 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'es-CO,es;q=0.9',
        Referer: `${this.origin}/`,
      };
      const cookie = this.jar.header();
      if (cookie) headers.Cookie = cookie;
      if (options.ajax) headers['X-Requested-With'] = 'XMLHttpRequest';
      if (options.method === 'POST') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      }
      const response = await this.fetch(url, {
        method: options.method ?? 'GET',
        headers,
        body: options.method === 'POST' ? (options.body ?? '') : undefined,
        redirect: 'manual',
        signal: AbortSignal.timeout(60_000),
      });
      this.jar.absorb(response.headers.getSetCookie());
      if (response.status === 403 || response.status === 429) {
        throw new DianPortalError(
          'blocked',
          'La DIAN bloqueó la consulta por sus controles de seguridad; espere un rato e intente de nuevo',
        );
      }
      const location = response.headers.get('location');
      if (!options.followRedirects || response.status < 300 || response.status >= 400 || !location) {
        return response;
      }
      url = new URL(location, url);
      if (url.origin !== this.origin) return response;
      options = { followRedirects: true };
    }
    throw new DianPortalError('portal', 'El portal redirigió demasiadas veces');
  }
}

function assertNotBlocked(html: string): void {
  if (/Solicitud bloqueada por controles de seguridad/i.test(html)) {
    throw new DianPortalError(
      'blocked',
      'La DIAN bloqueó la consulta por sus controles de seguridad; espere un rato e intente de nuevo',
    );
  }
}

/** Lee la tabla de tareas de exportación (#tableExport): rango, grupo, total, estado y descarga. */
export function parseExportTasks(html: string): ExportTask[] {
  const root = parseHtml(html);
  const tasks: ExportTask[] = [];
  for (const row of root.querySelectorAll('#tableExport tbody tr')) {
    const cells = row.querySelectorAll('td').map((cell) => cell.text.replace(/\s+/g, ' ').trim());
    const [, , range = '', group = '', , total = ''] = cells;
    const dates = /Desde (\d{2})-(\d{2})-(\d{4}) Hasta (\d{2})-(\d{2})-(\d{4})/.exec(range);
    if (!dates) continue;
    const link = row.querySelector('a[href*="DownloadExportedZipFile"]')?.getAttribute('href');
    const statusCell = row.querySelectorAll('td')[6];
    const ready = statusCell?.querySelector('.fa-check') !== null;
    const processing = statusCell?.querySelector('.fa-spin') !== null;
    tasks.push({
      startDate: `${dates[3]}-${dates[2]}-${dates[1]}`,
      endDate: `${dates[6]}-${dates[5]}-${dates[4]}`,
      group,
      total: /^\d+$/.test(total) ? Number(total) : null,
      status: ready && link ? 'ready' : processing ? 'processing' : link ? 'ready' : 'failed',
      downloadPath: link ? link.replace(/&amp;/g, '&') : null,
    });
  }
  return tasks;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
