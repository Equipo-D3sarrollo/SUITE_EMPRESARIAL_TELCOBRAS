import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

/** PDF mínimo de una página con las líneas de texto dadas (Helvetica), con su tabla de referencias. */
function buildPdf(lines: readonly string[]): Buffer {
  // En los textos de un PDF, \, ( y ) se escapan con una barra invertida.
  const pdfText = (text: string) => text.replace(/[\\()]/g, (char) => `\\${char}`);
  const content = `BT /F1 9 Tf 40 750 Td ${lines.map((line) => `(${pdfText(line)}) Tj 0 -14 Td`).join(' ')} ET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

/** Protege el PDF con clave de usuario, como lo entrega la DIAN. */
async function encryptPdf(pdf: Buffer, password: string, qpdfPath: string): Promise<Buffer> {
  const directory = await mkdtemp(join(tmpdir(), 'datadian-test-'));
  try {
    const input = join(directory, 'in.pdf');
    const output = join(directory, 'out.pdf');
    await writeFile(input, pdf);
    await run(qpdfPath, ['--encrypt', password, `${password}-owner`, '256', '--', input, output]);
    return await readFile(output);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

/** Representación gráfica de prueba de una factura con su CUFE, con o sin clave. */
export async function dianPdf(cufe: string, qpdfPath: string, password?: string): Promise<Buffer> {
  const pdf = buildPdf([
    'FACTURA ELECTRONICA DE VENTA',
    'Representacion Grafica',
    'Codigo Unico de Factura - CUFE :',
    cufe.slice(0, 50),
    cufe.slice(50),
    'Numero de Factura: R1172766070',
  ]);
  return password ? encryptPdf(pdf, password, qpdfPath) : pdf;
}
