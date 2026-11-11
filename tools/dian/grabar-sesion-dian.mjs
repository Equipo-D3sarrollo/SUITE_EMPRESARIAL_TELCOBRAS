// Graba una sesión en el catálogo de factura electrónica de la DIAN para construir el extractor de
// DataDian: abre Edge, registra todo el tráfico (HAR), toma capturas y guarda lo que se descargue.
//
//   node tools/dian/grabar-sesion-dian.mjs
//
// Todo queda en tools/dian/sesion/<fecha>/ (carpeta ignorada por git). El HAR contiene las cookies de
// la sesión y el enlace del token: es información sensible, válida unos 60 minutos. No se comparte
// fuera del equipo.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const require = createRequire(new URL('../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const LOGIN_URL = 'https://catalogo-vpfe.dian.gov.co/User/Login';
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = fileURLToPath(new URL(`./sesion/${stamp}/`, import.meta.url));
const shotsDir = `${outDir}capturas/`;
const downloadsDir = `${outDir}descargas/`;
for (const dir of [outDir, shotsDir, downloadsDir]) mkdirSync(dir, { recursive: true });

const readline = createInterface({ input: stdin, output: stdout });
const tokenLink = (
  await readline.question(
    'Pegue el enlace del correo "Token acceso DIAN" (o Enter para abrir la página de ingreso): ',
  )
).trim();

const browser = await chromium.launch({ channel: 'msedge', headless: false });
const context = await browser.newContext({
  recordHar: { path: `${outDir}sesion.har`, content: 'embed' },
  acceptDownloads: true,
  viewport: { width: 1400, height: 900 },
});
const page = await context.newPage();

const log = [];
let shot = 0;
const capture = async (reason) => {
  shot += 1;
  const file = `${String(shot).padStart(3, '0')}-${reason}.png`;
  try {
    await page.screenshot({ path: `${shotsDir}${file}`, fullPage: true });
  } catch {
    // La página cambió mientras se capturaba: no importa, la siguiente captura la recoge.
  }
};

page.on('response', (response) => {
  const request = response.request();
  log.push(
    `${new Date().toISOString()} ${response.status()} ${request.method()} ${response.url()} [${response.headers()['content-type'] ?? ''}]`,
  );
});
page.on('load', () => capture('pagina'));
page.on('download', async (download) => {
  const name = download.suggestedFilename();
  await download.saveAs(`${downloadsDir}${name}`);
  log.push(`${new Date().toISOString()} DESCARGA ${name} <- ${download.url()}`);
  console.log(`  ✓ descargado: ${name}`);
});

await page.goto(tokenLink || LOGIN_URL);

console.log(`
Se abrió Edge. Haga en esa ventana, con calma, estos pasos (todo queda grabado):

  1. Si no pegó el enlace del token: elija Empresa, escriba el NIT y pida el token; abra el correo
     "Token acceso DIAN" en otra pestaña y entre con el enlace.
  2. Abra "Documentos recibidos".
  3. Filtre por un rango corto de fechas (uno o dos días con pocas facturas) y consulte.
  4. Si hay más de una página, pase a la página 2 y vuelva.
  5. Abra "Descargar listados", elija el mismo rango y descargue el Excel.
  6. Abra una factura del listado y descargue su PDF y, si lo ofrece, su XML o ZIP.
  7. Repita el paso 6 con una segunda factura.

Cuando termine, vuelva a esta ventana y presione Enter.
`);

await readline.question('');
readline.close();
await capture('final');
writeFileSync(`${outDir}peticiones.txt`, `${log.join('\n')}\n`);
await context.close();
await browser.close();

console.log(`
Listo. Entregue al desarrollo la carpeta completa:
  ${outDir}
Contiene: sesion.har (tráfico completo), peticiones.txt (índice), capturas/ y descargas/.
`);
