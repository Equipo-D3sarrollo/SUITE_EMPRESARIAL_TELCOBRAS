import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import {
  readFirstSheet,
  serialToIsoDate,
  XlsxReadError,
} from '../src/modules/documents/xlsx-reader.js';

/** Libro mínimo con las etiquetas prefijadas `x:` que exceljs no reconoce. */
function workbook(sheetXml: string, sharedStrings?: string): Buffer {
  const files: Record<string, Uint8Array> = {
    'xl/workbook.xml': strToU8(
      '<x:workbook xmlns:x="urn:x" xmlns:r="urn:r"><x:sheets>' +
        '<x:sheet name="Hoja1" sheetId="1" r:id="rId1"/></x:sheets></x:workbook>',
    ),
    'xl/_rels/workbook.xml.rels': strToU8(
      '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>',
    ),
    'xl/worksheets/sheet1.xml': strToU8(sheetXml),
  };
  if (sharedStrings) files['xl/sharedStrings.xml'] = strToU8(sharedStrings);
  return Buffer.from(zipSync(files));
}

describe('readFirstSheet', () => {
  it('lee texto compartido, en línea y por tramos, números y booleanos; los folios siguen como texto', () => {
    const file = workbook(
      '<x:worksheet xmlns:x="urn:x"><x:sheetData>' +
        '<x:row r="1"><x:c r="A1" t="s"><x:v>0</x:v></x:c><x:c r="C1" t="s"><x:v>1</x:v></x:c></x:row>' +
        '<x:row r="3"><x:c r="A3" t="str"><x:v>0123</x:v></x:c><x:c r="B3"><x:v>1500.5</x:v></x:c>' +
        '<x:c r="C3" t="inlineStr"><x:is><x:t>en línea</x:t></x:is></x:c><x:c r="D3" t="b"><x:v>1</x:v></x:c></x:row>' +
        '</x:sheetData></x:worksheet>',
      '<x:sst xmlns:x="urn:x"><x:si><x:t>CUFE</x:t></x:si>' +
        '<x:si><x:r><x:t>Total </x:t></x:r><x:r><x:t>COP</x:t></x:r></x:si></x:sst>',
    );

    expect(readFirstSheet(file).rows).toEqual([
      ['CUFE', undefined, 'Total COP'],
      [],
      ['0123', 1500.5, 'en línea', 'TRUE'],
    ]);
  });

  it('rechaza lo que no es un libro de Excel', () => {
    expect(() => readFirstSheet(Buffer.from('no es un zip'))).toThrow(XlsxReadError);
    expect(() => readFirstSheet(Buffer.from(zipSync({ 'a.txt': strToU8('x') })))).toThrow(
      XlsxReadError,
    );
  });
});

describe('serialToIsoDate', () => {
  it('convierte el número de serie de Excel en fecha ISO', () => {
    expect(serialToIsoDate(45658)).toBe('2025-01-01');
  });
});
