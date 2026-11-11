import { XMLParser } from 'fast-xml-parser';
import { unzipSync } from 'fflate';

/**
 * Lector mínimo de .xlsx (OOXML) para los listados de la DIAN. Su exportador escribe las etiquetas con
 * el prefijo `x:` (<x:workbook>, <x:row>…), que exceljs no reconoce; aquí los prefijos se ignoran.
 * Devuelve la primera hoja como filas de valores simples: texto, número o null. Las fechas con formato
 * de Excel llegan como su número de serie; quien lee la columna decide cómo convertirlo.
 */

export type CellValue = string | number | null;

export interface Sheet {
  /** Filas en orden, cada una con sus celdas por índice de columna (0 = A). Las vacías son null. */
  rows: CellValue[][];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  removeNSPrefix: true,
  // Sin conversión automática: "0123" (un folio) debe seguir siendo texto.
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: false,
  isArray: (name) => ['sheet', 'Relationship', 'si', 'row', 'c', 'r'].includes(name),
});

export class XlsxReadError extends Error {}

export function readFirstSheet(file: Buffer): Sheet {
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(new Uint8Array(file.buffer, file.byteOffset, file.byteLength));
  } catch {
    throw new XlsxReadError('not a zip');
  }
  const text = (path: string) => {
    const entry = entries[path.replace(/^\//, '')];
    return entry ? new TextDecoder('utf-8').decode(entry).replace(/^﻿/, '') : undefined;
  };

  const workbookXml = text('xl/workbook.xml');
  const relsXml = text('xl/_rels/workbook.xml.rels');
  if (!workbookXml || !relsXml) throw new XlsxReadError('not a workbook');
  const workbook = parser.parse(workbookXml) as WorkbookXml;
  const rels = parser.parse(relsXml) as RelsXml;
  const firstSheet = workbook.workbook?.sheets?.sheet?.[0];
  if (!firstSheet) throw new XlsxReadError('no sheets');
  const relationships = rels.Relationships?.Relationship ?? [];
  // removeNSPrefix también quita el prefijo de los atributos: r:id llega como id.
  const sheetRelation = firstSheet['@id'] ?? firstSheet['@r:id'];
  const target = relationships.find((rel) => rel['@Id'] === sheetRelation)?.['@Target'];
  if (!target) throw new XlsxReadError('sheet without target');
  const sheetXml = text(target.startsWith('/') ? target : `xl/${target}`);
  if (!sheetXml) throw new XlsxReadError('sheet part missing');

  const sharedStrings = readSharedStrings(text('xl/sharedStrings.xml'));
  const sheet = parser.parse(sheetXml) as SheetXml;
  const rows: CellValue[][] = [];
  for (const row of sheet.worksheet?.sheetData?.row ?? []) {
    const index = Number(row['@r']) - 1;
    const cells: CellValue[] = [];
    for (const cell of row.c ?? []) {
      const column = columnIndex(cell['@r'] ?? '');
      const value = cellValue(cell, sharedStrings);
      if (value !== null) cells[column] = value;
    }
    rows[index] = cells;
  }
  // Filas sin celdas (huecos en r="…") quedan vacías.
  for (let index = 0; index < rows.length; index++) rows[index] ??= [];
  return { rows };
}

function readSharedStrings(xml: string | undefined): string[] {
  if (!xml) return [];
  const parsed = parser.parse(xml) as SharedStringsXml;
  return (parsed.sst?.si ?? []).map(richText);
}

/** Texto de un <si> o <is>: directo (<t>) o por tramos con formato (<r><t>…</t></r>). */
function richText(node: RichTextXml | undefined): string {
  if (!node) return '';
  if (node.t !== undefined) return textOf(node.t);
  return (node.r ?? []).map((run) => textOf(run.t)).join('');
}

function textOf(value: string | { '#text'?: string } | undefined): string {
  if (value === undefined) return '';
  return typeof value === 'string' ? value : (value['#text'] ?? '');
}

function cellValue(cell: CellXml, sharedStrings: string[]): CellValue {
  const type = cell['@t'];
  if (type === 'inlineStr') return richText(cell.is);
  const raw = cell.v === undefined ? undefined : textOf(cell.v);
  if (raw === undefined) return null;
  if (type === 's') return sharedStrings[Number(raw)] ?? '';
  if (type === 'str' || type === 'e') return raw;
  if (type === 'b') return raw === '1' ? 'TRUE' : 'FALSE';
  const number = Number(raw);
  return Number.isFinite(number) ? number : raw;
}

function columnIndex(reference: string): number {
  let index = 0;
  for (const letter of reference.replace(/\d+$/, '')) {
    index = index * 26 + (letter.charCodeAt(0) - 64);
  }
  return index - 1;
}

/** Número de serie de Excel (días desde 1899-12-30) a fecha ISO. */
export function serialToIsoDate(serial: number): string {
  const ms = Math.round((serial - 25569) * 86_400_000);
  return new Date(ms).toISOString().slice(0, 10);
}

interface WorkbookXml {
  workbook?: { sheets?: { sheet?: { '@id'?: string; '@r:id'?: string; '@name'?: string }[] } };
}
interface RelsXml {
  Relationships?: { Relationship?: { '@Id'?: string; '@Target'?: string }[] };
}
interface SharedStringsXml {
  sst?: { si?: RichTextXml[] };
}
interface RichTextXml {
  t?: string | { '#text'?: string };
  r?: { t?: string | { '#text'?: string } }[];
}
interface CellXml {
  '@r'?: string;
  '@t'?: string;
  v?: string | { '#text'?: string };
  is?: RichTextXml;
}
interface SheetXml {
  worksheet?: { sheetData?: { row?: { '@r'?: string; c?: CellXml[] }[] } };
}
