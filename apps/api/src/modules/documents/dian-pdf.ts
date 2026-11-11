import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { UnprocessableEntityException } from '@nestjs/common';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * PDF de la DIAN (Representación Gráfica). Llega protegido con clave y la clave es el NIT del
 * adquiriente (DD-11). qpdf lo abre y guarda una copia sin clave; pdf.js lee el CUFE impreso
 * para asociarlo con su factura.
 */

const QPDF_TIMEOUT_MS = 30_000;
const MAX_PAGES_TO_READ = 3;

/** Claves posibles a partir del NIT de la organización ("900281488-6"): sin dígito, con él y con guion. */
export function nitPasswords(nit: string): string[] {
  const [base = '', checkDigit = ''] = nit.replace(/[.\s]/g, '').split('-');
  return [...new Set([base, `${base}${checkDigit}`, nit.replace(/[.\s]/g, '')].filter(Boolean))];
}

/** Abre el PDF con la primera clave que funcione y devuelve la copia sin clave. */
export async function openDianPdf(
  file: Buffer,
  passwords: readonly string[],
  qpdfPath: string,
): Promise<Buffer> {
  if (file.subarray(0, 5).toString('latin1') !== '%PDF-') {
    throw new UnprocessableEntityException('El archivo no es un PDF');
  }
  const directory = await mkdtemp(join(tmpdir(), 'datadian-'));
  try {
    const input = join(directory, 'in.pdf');
    const output = join(directory, 'out.pdf');
    await writeFile(input, file);
    for (const password of passwords) {
      const result = await runQpdf(
        qpdfPath,
        ['--password-file=-', '--decrypt', input, output],
        password,
      );
      // 0: sin novedades. 3: abrió con advertencias (por ejemplo, tabla de referencias reparada).
      if (result.code === 0 || result.code === 3) return await readFile(output);
      if (!/invalid password/i.test(result.stderr)) {
        throw new UnprocessableEntityException('El PDF está dañado o no se pudo abrir');
      }
    }
    throw new UnprocessableEntityException('El PDF no se pudo abrir con el NIT de la organización');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

/** CUFE o CUDE impresos en el PDF: secuencias de exactamente 96 caracteres hexadecimales. */
export async function findCufes(pdf: Buffer): Promise<string[]> {
  const task = getDocument({
    data: new Uint8Array(pdf),
    useSystemFonts: false,
    verbosity: 0,
  });
  try {
    const document = await task.promise;
    let text = '';
    for (let number = 1; number <= Math.min(document.numPages, MAX_PAGES_TO_READ); number++) {
      const page = await document.getPage(number);
      const content = await page.getTextContent();
      text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
      text += '\n';
    }
    return cufeCandidates(text);
  } finally {
    await task.destroy();
  }
}

/**
 * El CUFE puede venir partido en varias líneas. Se unen palabras hexadecimales consecutivas hasta
 * sumar exactamente 96 caracteres; así una palabra vecina como "de" no lo alarga ni lo corta.
 */
export function cufeCandidates(text: string): string[] {
  // Se corta en todo lo que no sea letra o número: "CUFE:44a5…" deja el código como palabra aparte.
  const words = text
    .toLowerCase()
    .split(/[^0-9a-z]+/)
    .filter(Boolean);
  const found = new Set<string>();
  for (let start = 0; start < words.length; start++) {
    let joined = '';
    for (let end = start; end < words.length; end++) {
      const word = words[end] ?? '';
      if (!/^[0-9a-f]+$/.test(word)) break;
      joined += word;
      if (joined.length === 96) found.add(joined);
      if (joined.length >= 96) break;
    }
  }
  return [...found];
}

function runQpdf(
  qpdfPath: string,
  args: string[],
  password: string,
): Promise<{ code: number | null; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(qpdfPath, args, { stdio: ['pipe', 'ignore', 'pipe'], windowsHide: true });
    let stderr = '';
    const timer = setTimeout(() => child.kill(), QPDF_TIMEOUT_MS);
    child.stderr.setEncoding('utf8').on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(new Error(`qpdf could not be started (${qpdfPath}): ${error.message}`));
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stderr });
    });
    // La clave va por la entrada estándar: no queda en la lista de procesos.
    child.stdin.end(`${password}\n`);
  });
}
