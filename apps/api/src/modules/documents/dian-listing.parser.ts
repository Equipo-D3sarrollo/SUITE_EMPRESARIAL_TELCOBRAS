import { UnprocessableEntityException } from '@nestjs/common';
import { cufeSchema, type DianListingFields } from '@telcobras/contracts';
import { type CellValue, readFirstSheet, serialToIsoDate, XlsxReadError } from './xlsx-reader.js';

/**
 * Lee el listado de documentos que exporta el catálogo de la DIAN (.xlsx) y conserva solo los campos
 * de docs/etapas/ETAPA_2_DATADIAN.md §1.1; las demás columnas del archivo se ignoran.
 * Las columnas se buscan por el nombre del encabezado, no por su posición. Las de la hoja de trabajo
 * de Telcobras (centro de costos, tipo, acuse, factura, observaciones) son opcionales: la exportación
 * de la DIAN no las trae.
 */

const MAX_LISTING_ROWS = 20_000;
const HEADER_SEARCH_ROWS = 15;

type Field = keyof DianListingFields;
type Kind = 'text' | 'date' | 'datetime' | 'amount' | 'cufe';

interface ColumnSpec {
  field: Field;
  /** Nombre de la columna tal como la ve el usuario; se usa en los mensajes de error. */
  label: string;
  kind: Kind;
  required: boolean;
  /** Recibe el encabezado normalizado: minúsculas, sin tildes y solo letras y números. */
  matches: (header: string) => boolean;
}

const is =
  (...names: string[]) =>
  (header: string) =>
    names.includes(header);

const COLUMNS: readonly ColumnSpec[] = [
  {
    field: 'documentType',
    label: 'Tipo de documento',
    kind: 'text',
    required: true,
    matches: is('tipodedocumento', 'tipodocumento'),
  },
  { field: 'cufe', label: 'CUFE/CUDE', kind: 'cufe', required: true, matches: is('cufecude', 'cufe') },
  { field: 'folio', label: 'Folio', kind: 'text', required: true, matches: is('folio') },
  { field: 'prefix', label: 'Prefijo', kind: 'text', required: true, matches: is('prefijo') },
  {
    field: 'paymentMethod',
    label: 'Medio de Pago',
    kind: 'text',
    required: true,
    matches: is('mediodepago'),
  },
  {
    field: 'issueDate',
    label: 'Fecha Emisión',
    kind: 'date',
    required: true,
    matches: is('fechaemision', 'fechadeemision'),
  },
  {
    field: 'receivedAt',
    label: 'Fecha Recepción',
    kind: 'datetime',
    required: false,
    matches: is('fecharecepcion', 'fechaderecepcion'),
  },
  { field: 'issuerNit', label: 'NIT Emisor', kind: 'text', required: true, matches: is('nitemisor') },
  {
    field: 'issuerName',
    label: 'Nombre Emisor',
    kind: 'text',
    required: true,
    matches: is('nombreemisor'),
  },
  { field: 'iva', label: 'IVA', kind: 'amount', required: true, matches: is('iva') },
  { field: 'inc', label: 'INC', kind: 'amount', required: true, matches: is('inc') },
  { field: 'total', label: 'Total', kind: 'amount', required: true, matches: is('total') },
  { field: 'dianStatus', label: 'Estado', kind: 'text', required: true, matches: is('estado') },
  { field: 'dianGroup', label: 'Grupo', kind: 'text', required: true, matches: is('grupo') },
  {
    field: 'costCenter',
    label: 'Centro de costos',
    kind: 'text',
    required: false,
    matches: is('centrodecostos', 'centrodecosto'),
  },
  { field: 'paymentType', label: 'TIPO', kind: 'text', required: false, matches: is('tipo') },
  {
    field: 'acknowledgmentStatus',
    label: 'Estado (Acuse)',
    kind: 'text',
    required: false,
    matches: (header) => header.startsWith('estadoacuse'),
  },
  {
    field: 'invoiceReference',
    label: 'FACTURA',
    kind: 'text',
    required: false,
    matches: is('factura'),
  },
  {
    field: 'observations',
    label: 'Observaciones',
    kind: 'text',
    required: false,
    matches: (header) => header.startsWith('observacion'),
  },
];

interface RejectedRow {
  row: number;
  reason: string;
}

export interface ParsedListing {
  totalRows: number;
  documents: DianListingFields[];
  rejected: RejectedRow[];
}

class RowError extends Error {}

export function parseDianListing(file: Buffer): ParsedListing {
  let rows: CellValue[][];
  try {
    rows = readFirstSheet(file).rows;
  } catch (error) {
    if (error instanceof XlsxReadError) {
      throw new UnprocessableEntityException('El archivo no es un Excel (.xlsx) válido');
    }
    throw error;
  }

  const header = findHeader(rows);
  const documents: DianListingFields[] = [];
  const rejected: RejectedRow[] = [];
  const seen = new Set<string>();
  let totalRows = 0;

  for (let index = header.rowIndex + 1; index < rows.length; index++) {
    const row = rows[index] ?? [];
    const rowNumber = index + 1;
    const raw = (field: Field) => {
      const column = header.columns[field];
      return column === undefined ? null : (row[column] ?? null);
    };
    if (COLUMNS.every(({ field }) => isBlank(raw(field)))) continue;

    totalRows++;
    if (totalRows > MAX_LISTING_ROWS) {
      throw new UnprocessableEntityException(
        `El listado supera el máximo de ${MAX_LISTING_ROWS} filas por carga`,
      );
    }
    try {
      const document = Object.fromEntries(
        COLUMNS.map(({ field, kind, label }) => [field, convert(kind, label, raw(field))]),
      ) as DianListingFields;
      // Un CUFE repetido dentro del mismo archivo es la misma factura: se toma la primera fila.
      if (seen.has(document.cufe)) {
        rejected.push({ row: rowNumber, reason: 'CUFE repetido dentro del archivo' });
        continue;
      }
      seen.add(document.cufe);
      documents.push(document);
    } catch (error) {
      if (!(error instanceof RowError)) throw error;
      rejected.push({ row: rowNumber, reason: error.message });
    }
  }
  return { totalRows, documents, rejected };
}

function findHeader(rows: CellValue[][]): {
  rowIndex: number;
  columns: Partial<Record<Field, number>>;
} {
  let best: { rowIndex: number; columns: Partial<Record<Field, number>> } | undefined;
  for (let rowIndex = 0; rowIndex < Math.min(rows.length, HEADER_SEARCH_ROWS); rowIndex++) {
    const columns: Partial<Record<Field, number>> = {};
    (rows[rowIndex] ?? []).forEach((cell, column) => {
      const spec = COLUMNS.find(({ matches }) => matches(normalizeHeader(cell)));
      // Si un encabezado aparece dos veces, vale el primero.
      if (spec && columns[spec.field] === undefined) columns[spec.field] = column;
    });
    if (!best || Object.keys(columns).length > Object.keys(best.columns).length) {
      best = { rowIndex, columns };
    }
  }

  const missing = COLUMNS.filter(
    ({ field, required }) => required && best?.columns[field] === undefined,
  );
  if (!best || missing.length > 0) {
    throw new UnprocessableEntityException(
      `Al listado le faltan columnas: ${missing.map(({ label }) => label).join(', ')}`,
    );
  }
  return best;
}

function normalizeHeader(value: CellValue): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const isBlank = (value: CellValue) => value === null || String(value).trim() === '';

function convert(kind: Kind, label: string, value: CellValue): string | null {
  if (kind === 'cufe') {
    const cufe = cufeSchema.safeParse(isBlank(value) ? '' : String(value));
    if (!cufe.success) throw new RowError(`${label} no válido`);
    return cufe.data;
  }
  if (isBlank(value)) return null;
  if (kind === 'date') return toIsoDate(label, value);
  if (kind === 'datetime') return toDateTime(value);
  if (kind === 'amount') return toAmount(label, value);
  return String(value).trim();
}

/** Acepta "11-11-2026", "11/11/2026", "2026-11-11", "2026-11-11T16:03:55" y el número de serie de Excel. */
function toIsoDate(label: string, value: CellValue): string {
  const iso = isoDateOf(value);
  if (iso === null) throw new RowError(`${label} no válida`);
  return iso;
}

function isoDateOf(value: CellValue): string | null {
  if (typeof value === 'number') return Number.isFinite(value) ? serialToIsoDate(value) : null;
  const text = String(value).trim();
  const dayFirst = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/.exec(text);
  const iso = dayFirst
    ? `${dayFirst[3]}-${dayFirst[2]?.padStart(2, '0')}-${dayFirst[1]?.padStart(2, '0')}`
    : (/^\d{4}-\d{2}-\d{2}/.exec(text)?.[0] ?? '');
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (iso === '' || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== iso) {
    return null;
  }
  return iso;
}

/** Fecha y hora de recepción en hora de Colombia ("2026-11-11T16:03:55" → "…-05:00"). Si no se entiende, null. */
function toDateTime(value: CellValue): string | null {
  const date = isoDateOf(value);
  if (date === null) return null;
  const time = typeof value === 'string' ? /[T ](\d{2}:\d{2}(?::\d{2})?)/.exec(value)?.[1] : null;
  return `${date}T${time ? time.padEnd(8, ':00') : '00:00:00'}-05:00`;
}

function toAmount(label: string, value: CellValue): string {
  if (typeof value === 'number' && Number.isFinite(value)) return value.toFixed(2);
  let text = String(value).replace(/[$\s]/g, '');
  // Formato colombiano: punto de miles y coma decimal ("77.901,00").
  if (text.includes(',')) text = text.replaceAll('.', '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(text)) text = text.replaceAll('.', '');
  if (!/^-?\d+(\.\d+)?$/.test(text)) throw new RowError(`${label} no es un valor numérico`);
  return Number(text).toFixed(2);
}
