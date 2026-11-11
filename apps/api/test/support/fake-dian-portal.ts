import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';
import { strToU8, zipSync } from 'fflate';

export const FAKE_DIAN_TOKEN = 'tok-valido-123';

/** Una fila del listado tal como la exporta la DIAN (32 columnas; aquí las que usa DataDian). */
export interface FakeDianDocument {
  cufe: string;
  folio: string;
  prefix: string;
  issueDate: string; // dd-mm-yyyy
  receivedAt: string; // yyyy-mm-ddTHH:MM:SS
  issuerNit: string;
  issuerName: string;
  receiverNit: string;
  iva: number;
  total: number;
}

interface Task {
  rk: string;
  startDate: string;
  endDate: string;
  group: string;
  pollsLeft: number;
  documents: FakeDianDocument[];
}

const DIAN_HEADERS = [
  'Tipo de documento',
  'CUFE/CUDE',
  'Folio',
  'Prefijo',
  'Divisa',
  'Forma de Pago',
  'Medio de Pago',
  'Fecha Emisión',
  'Fecha Recepción',
  'NIT Emisor',
  'Nombre Emisor',
  'NIT Receptor',
  'Nombre Receptor',
  'IVA',
  'ICA',
  'IC',
  'INC',
  'Timbre',
  'INC Bolsas',
  'IN Carbono',
  'IN Combustibles',
  'IC Datos',
  'ICL',
  'INPP',
  'IBUA',
  'ICUI',
  'Rete IVA',
  'Rete Renta',
  'Rete ICA',
  'Total',
  'Estado',
  'Grupo',
];

/**
 * Portal de la DIAN de prueba: reproduce las rutas y el HTML que grabamos del catálogo real
 * (AuthToken, Export, TasksPartial, DownloadExportedZipFile) y un Excel con el mismo formato
 * (etiquetas con prefijo x:) que exceljs no sabe leer.
 */
export async function startFakeDianPortal(options: {
  nit: string;
  documents: (startDate: string, endDate: string) => FakeDianDocument[];
  /** Sondeos de TasksPartial que la tarea pasa "Procesando" antes de estar "Listo". */
  pollsUntilReady?: number;
}) {
  const sessions = new Set<string>();
  const tasks: Task[] = [];
  const calls: string[] = [];
  let blockNext = false;
  let origin = '';

  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const cookies = Object.fromEntries(
      (request.headers.cookie ?? '')
        .split(';')
        .map((pair) => pair.trim().split('='))
        .filter(([name]) => name) as [string, string][],
    );
    const authenticated = sessions.has(cookies['.AspNet.ApplicationCookie'] ?? '');
    calls.push(`${request.method} ${url.pathname}`);
    const send = (status: number, body: string | Uint8Array, headers: Record<string, string | string[]> = {}) => {
      response.writeHead(status, headers);
      response.end(body);
    };
    const html = (status: number, body: string, headers: Record<string, string | string[]> = {}) =>
      send(status, body, { 'content-type': 'text/html; charset=utf-8', ...headers });

    if (blockNext) {
      blockNext = false;
      return html(200, '<html><body><h1>Solicitud bloqueada por controles de seguridad</h1></body></html>');
    }

    switch (`${request.method} ${url.pathname}`) {
      case 'GET /User/AuthToken': {
        if (url.searchParams.get('token') !== FAKE_DIAN_TOKEN || url.searchParams.get('rk') !== options.nit) {
          return html(200, '<html><body>El token no es válido</body></html>');
        }
        const session = randomUUID();
        sessions.add(session);
        const expires = new Date(Date.now() + 14 * 86_400_000).toUTCString();
        return send(302, '', {
          location: '/',
          'set-cookie': [
            '.AspNet.ExternalCookie=; path=/; expires=Thu, 01-Jan-1970 00:00:00 GMT; secure; HttpOnly',
            `.AspNet.ApplicationCookie=${session}; path=/; expires=${expires}; secure; HttpOnly`,
            'ARRAffinity=abc;Path=/;HttpOnly;Secure',
          ],
        });
      }
      case 'GET /':
        return html(200, '<html><body>Inicio</body></html>');
      case 'POST /Home/GetEmittedAndreceivedTotal':
        return send(200, JSON.stringify({ success: true, emitted: 0, received: 0, authenticated }), {
          'content-type': 'application/json; charset=utf-8',
        });
      case 'GET /Document/Export':
        if (!authenticated) return send(302, '', { location: '/User/Login' });
        return html(
          200,
          `<html><body><form action="/Document/Export" id="export-form" method="post">
            <input name="__RequestVerificationToken" type="hidden" value="csrf-${options.nit}" />
            <select id="filter-groups" name="GroupCode"><option value="0">Todos</option><option value="1">Emitidos</option><option value="2">Recibidos</option></select>
          </form><div id="tasks-container"></div></body></html>`,
          { 'set-cookie': '__RequestVerificationToken=cookie-csrf; path=/; HttpOnly' },
        );
      case 'POST /Document/Export': {
        if (!authenticated) return send(302, '', { location: '/User/Login' });
        const form = new URLSearchParams(await readBody(request));
        if (form.get('__RequestVerificationToken') !== `csrf-${options.nit}` || form.get('GroupCode') !== '2') {
          return send(200, 'false', { 'content-type': 'application/json; charset=utf-8' });
        }
        const startDate = form.get('StartDate') ?? '';
        const endDate = form.get('EndDate') ?? '';
        tasks.unshift({
          rk: randomUUID(),
          startDate,
          endDate,
          group: 'Recibidos',
          pollsLeft: options.pollsUntilReady ?? 2,
          documents: options.documents(startDate, endDate),
        });
        return send(200, 'true', { 'content-type': 'application/json; charset=utf-8' });
      }
      case 'POST /Document/TasksPartial': {
        if (!authenticated) return send(302, '', { location: '/User/Login' });
        const rows = tasks
          .map((task) => {
            if (task.pollsLeft > 0) task.pollsLeft -= 1;
            const ready = task.pollsLeft === 0;
            const range = `Desde ${ddmmyyyy(task.startDate)} Hasta ${ddmmyyyy(task.endDate)}`;
            return `<tr><td>11-11-2026</td><td>user@dian.co</td><td>${range}</td><td>${task.group}</td><td><i class="fa fa-file-excel-o"></i> Excel</td><td class="text-left">${ready ? task.documents.length : ''}</td><td class="text-left"><i class="fa ${ready ? 'fa-check fa-lg text-gosocket' : 'fa-circle-o-notch fa-spin fa-lg text-primary'} add-tooltip" title="${ready ? 'Listo' : 'Procesando'}"></i></td><td class="text-left">${ready ? `<a class="btn btn-xs" href="/Document/DownloadExportedZipFile?pk=${options.nit}&amp;rk=${task.rk}" title="Descargar"><i class="fa fa-download"></i></a>` : '<a class="btn btn-xs" href="#" title="Cancelar"><i class="fa fa-remove"></i></a>'}</td></tr>`;
          })
          .join('');
        return html(
          200,
          `<div class="table-responsive"><table id="tableExport"><thead><tr><th>Fecha</th><th>Usuario</th><th>Rango</th><th>Grupo</th><th>Tipo</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${rows}</tbody></table></div>`,
        );
      }
      case 'GET /Document/DownloadExportedZipFile': {
        if (!authenticated) return send(302, '', { location: '/User/Login' });
        const rk = url.searchParams.get('rk');
        return send(302, '', { location: `${origin}/blob/export/${rk}.zip?sig=firma` });
      }
      default: {
        const blob = /^\/blob\/export\/(.+)\.zip$/.exec(url.pathname);
        const task = blob && tasks.find((item) => item.rk === blob[1]);
        if (!task) return html(404, 'No encontrado');
        const zip = zipSync({ [`${task.rk}.xlsx`]: dianXlsx(task.documents) });
        return send(200, zip, { 'content-type': 'application/octet-stream' });
      }
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  origin = `http://127.0.0.1:${port}`;
  return {
    origin,
    tokenLink: (nit = options.nit, token = FAKE_DIAN_TOKEN) =>
      `${origin}/User/AuthToken?pk=1%7C2&rk=${nit}&token=${token}`,
    calls,
    /** Invalida todas las sesiones, como cuando la cookie del portal vence. */
    expireSessions: () => sessions.clear(),
    /** La siguiente petición responde la página de bloqueo de la DIAN. */
    blockNextRequest: () => {
      blockNext = true;
    },
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

function ddmmyyyy(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}-${month}-${year}`;
}

/** Excel en el formato del exportador de la DIAN: OOXML con etiquetas prefijadas con x:. */
export function dianXlsx(documents: FakeDianDocument[]): Uint8Array {
  const strings: string[] = [];
  const stringIndex = (text: string) => {
    const index = strings.indexOf(text);
    if (index >= 0) return index;
    strings.push(text);
    return strings.length - 1;
  };
  const column = (index: number) => {
    let name = '';
    let value = index + 1;
    while (value > 0) {
      const remainder = (value - 1) % 26;
      name = String.fromCharCode(65 + remainder) + name;
      value = Math.floor((value - 1) / 26);
    }
    return name;
  };
  const cell = (ref: string, value: string | number) =>
    typeof value === 'number'
      ? `<x:c r="${ref}" s="1"><x:v>${value}</x:v></x:c>`
      : `<x:c r="${ref}" s="1" t="s"><x:v>${stringIndex(value)}</x:v></x:c>`;
  const rows = [
    DIAN_HEADERS,
    ...documents.map((document) => [
      'Factura electrónica',
      document.cufe,
      document.folio,
      document.prefix,
      'COP',
      '1',
      '47',
      document.issueDate,
      document.receivedAt,
      document.issuerNit,
      document.issuerName,
      document.receiverNit,
      'ORGANIZACION DE PRUEBA S.A.S',
      document.iva,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      document.total,
      'Aprobado con notificación',
      'Recibido',
    ]),
  ];
  const sheetRows = rows
    .map(
      (values, rowIndex) =>
        `<x:row r="${rowIndex + 1}">${values.map((value, columnIndex) => cell(`${column(columnIndex)}${rowIndex + 1}`, value)).join('')}</x:row>`,
    )
    .join('');
  const escape = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const files = {
    '[Content_Types].xml':
      '<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" /><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" /></Types>',
    '_rels/.rels':
      '<?xml version="1.0" encoding="utf-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="/xl/workbook.xml" Id="rId1" /></Relationships>',
    'xl/workbook.xml':
      '<?xml version="1.0" encoding="utf-8"?><x:workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><x:sheets><x:sheet name="Rp_Doc" sheetId="1" r:id="rId2" /></x:sheets></x:workbook>',
    'xl/_rels/workbook.xml.rels':
      '<?xml version="1.0" encoding="utf-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="/xl/sharedStrings.xml" Id="rId3" /><Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="/xl/worksheets/sheet1.xml" Id="rId2" /></Relationships>',
    'xl/worksheets/sheet1.xml': `﻿<?xml version="1.0" encoding="utf-8" standalone="yes"?><x:worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><x:sheetData>${sheetRows}</x:sheetData></x:worksheet>`,
    'xl/sharedStrings.xml': `<?xml version="1.0" encoding="utf-8"?><x:sst xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${strings.map((text) => `<x:si><x:t>${escape(text)}</x:t></x:si>`).join('')}</x:sst>`,
  };
  return zipSync(Object.fromEntries(Object.entries(files).map(([name, text]) => [name, strToU8(text)])));
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
