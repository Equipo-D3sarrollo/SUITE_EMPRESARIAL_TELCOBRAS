// Presupuestos de carga de apps/web (doc madre §19.4). Se ejecuta después de `pnpm build`.
// Uso: node tools/check-bundle-size.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const KB = 1000;
const MAX_INITIAL_JS = 200 * KB;
const MAX_FONT_FILES = 3;
const MAX_FONTS = 120 * KB;
const DIST = fileURLToPath(new URL('../apps/web/dist/', import.meta.url));

/** JS que el navegador descarga al abrir la app: scripts del index.html y sus modulepreload. */
export function initialScripts(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
  const preloads = [...html.matchAll(/<link\b[^>]*\brel="modulepreload"[^>]*>/g)].map(
    (m) => m[0].match(/\bhref="([^"]+)"/)?.[1],
  );
  return [...new Set([...scripts, ...preloads].filter(Boolean))];
}

const isExternal = (url) => /^(?:[a-z]+:)?\/\//i.test(url);
const format = (bytes) => `${(bytes / KB).toFixed(1)} kB`;

function listFiles(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

function main() {
  let html;
  try {
    html = readFileSync(join(DIST, 'index.html'), 'utf8');
  } catch {
    console.error('✖ No existe apps/web/dist/index.html. Ejecuta antes: pnpm build');
    process.exitCode = 1;
    return;
  }
  const errors = [];

  let gzip = 0;
  let brotli = 0;
  console.log('JS inicial (comprimido):');
  for (const url of initialScripts(html)) {
    if (isExternal(url)) {
      errors.push(`script de terceros en el arranque: ${url} (doc madre §19.1)`);
      continue;
    }
    const content = readFileSync(join(DIST, url.replace(/^\//, '')));
    const sizes = {
      gzip: gzipSync(content, { level: 9 }).length,
      brotli: brotliCompressSync(content).length,
    };
    gzip += sizes.gzip;
    brotli += sizes.brotli;
    console.log(`  ${url}  gzip ${format(sizes.gzip)}  brotli ${format(sizes.brotli)}`);
  }
  console.log(
    `  Total: gzip ${format(gzip)}, brotli ${format(brotli)} (máximo ${format(MAX_INITIAL_JS)})`,
  );
  for (const [name, size] of Object.entries({ gzip, brotli })) {
    if (size > MAX_INITIAL_JS) {
      errors.push(
        `el JS inicial pesa ${format(size)} con ${name}; el máximo es ${format(MAX_INITIAL_JS)}`,
      );
    }
  }

  const fonts = listFiles(DIST).filter((file) => /^\.(?:woff2?|ttf|otf|eot)$/i.test(extname(file)));
  const woff2 = fonts.filter((file) => extname(file).toLowerCase() === '.woff2');
  const fontBytes = fonts.reduce((sum, file) => sum + statSync(file).size, 0);
  console.log(
    `Fuentes: ${fonts.length} archivo(s), ${format(fontBytes)} (máximo ${MAX_FONT_FILES} woff2 y ${format(MAX_FONTS)})`,
  );
  if (fonts.length > woff2.length) {
    errors.push(
      `hay fuentes en formatos distintos de woff2: ${fonts.length - woff2.length} archivo(s)`,
    );
  }
  if (woff2.length > MAX_FONT_FILES) {
    errors.push(
      `hay ${woff2.length} archivos woff2; el máximo es ${MAX_FONT_FILES} (Poppins 400/500/600, subset latino)`,
    );
  }
  if (fontBytes > MAX_FONTS) {
    errors.push(`las fuentes pesan ${format(fontBytes)}; el máximo es ${format(MAX_FONTS)}`);
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`✖ ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log('✔ Presupuestos de carga cumplidos (doc madre §19.4).');
}

if (import.meta.main) main();
