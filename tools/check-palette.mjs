// Falla si apps/ o packages/ usan un color fuera de la paleta oficial (doc madre §12.4.1, ADR-007).
// Uso: node tools/check-palette.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

// Valores RGB de los 6 colores oficiales y del rojo de error. La transparencia sobre ellos se permite
// (sombras con el negro, opacidad de Tailwind), pero no otro tono.
const OFFICIAL_RGB = new Set([
  '88bd4c', // --color-tb-verde
  '2491cc', // --color-tb-azul
  'f3cb35', // --color-tb-amarillo
  '888d91', // --color-tb-gris
  'ffffff', // --color-tb-blanco
  '000000', // --color-tb-negro
  'c62828', // --color-tb-error
]);

const TAILWIND_PALETTES =
  'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe';
const COLOR_UTILITIES =
  '--color|bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|inset-ring|outline|decoration|divide|accent|caret|fill|stroke|shadow|inset-shadow|drop-shadow|text-shadow|from|via|to|placeholder';
// white y black también son de la paleta por defecto: con --color-*: initial no generan CSS.
const TAILWIND_CLASS = new RegExp(
  `(?<![\\w-])(?:${COLOR_UTILITIES})-(?:(?:${TAILWIND_PALETTES})-(?:50|[1-9]00|950)|white|black)(?![\\w-])`,
  'g',
);

const HEX = /(?<![\w&])#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/gi;
// Sin "." ni "$" delante: x.rgb() o x.color() son llamadas de JS, no CSS.
const RGB = /(?<![\w.$-])rgba?\(([^)]*)\)/gi;
const OTHER_COLOR_FUNCTIONS =
  /(?<![\w.$-])(?:(hsla?|hwb|lab|lch|oklab|oklch)\(|color\((?=\s*(?:srgb|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz)))/gi;

// Colores con nombre de CSS, salvo white y black (son el blanco y el negro oficiales).
const NAMED_COLORS = new Set(
  `aliceblue antiquewhite aqua aquamarine azure beige bisque blanchedalmond blue blueviolet brown
  burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan
  darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid
  darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet
  deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro
  ghostwhite gold goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki
  lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow
  lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray
  lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine
  mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen
  mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace
  olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred
  papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue
  saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey
  snow springgreen steelblue tan teal thistle tomato turquoise violet wheat whitesmoke yellow
  yellowgreen`.split(/\s+/),
);
// Propiedad o atributo de color (CSS, estilos en línea, props de SVG o Recharts, JSON) y su valor.
const COLOR_PROPERTY =
  /(?<![\w-])[\w-]*(?:color|fill|stroke|background|border|outline|shadow)["']?\s*[:=]\s*([^;,\n]*)/gi;
const WORD = /(?<![\w.$#-])[a-z]+(?![\w(.-])/gi;

const SCANNED_EXTENSIONS = /\.(?:[cm]?[jt]sx?|css|html|svg|json|webmanifest)$/;
// Archivos generados: no se editan a mano.
const GENERATED = /(?:^|\/)(?:generated\/|openapi\.json$|openapi\.d\.ts$)|\.gen\.ts$/;

const isOfficialHex = (digits) => {
  const rgb = digits.length <= 4 ? [...digits.slice(0, 3)].map((c) => c + c).join('') : digits;
  return OFFICIAL_RGB.has(rgb.slice(0, 6).toLowerCase());
};

const isOfficialRgb = (args) => {
  const [r, g, b] = args
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  const hex = [r, g, b]
    .map((n) => (Number.isInteger(n) && n >= 0 && n <= 255 ? n.toString(16).padStart(2, '0') : 'x'))
    .join('');
  return OFFICIAL_RGB.has(hex);
};

/** Devuelve los colores fuera de la paleta en un texto: [{ line, column, message }]. */
export function findViolations(text) {
  const found = [];
  const report = (index, message) => {
    const before = text.slice(0, index);
    const line = before.split('\n').length;
    found.push({ line, column: index - before.lastIndexOf('\n'), message });
  };

  for (const m of text.matchAll(HEX)) {
    if (!isOfficialHex(m[1])) report(m.index, `color HEX ${m[0]} fuera de la paleta oficial`);
  }
  for (const m of text.matchAll(RGB)) {
    if (!isOfficialRgb(m[1])) report(m.index, `color ${m[0]} fuera de la paleta oficial`);
  }
  for (const m of text.matchAll(OTHER_COLOR_FUNCTIONS)) {
    report(m.index, `${m[1] ?? 'color'}() no está permitido; usa var(--color-tb-*)`);
  }
  for (const m of text.matchAll(TAILWIND_CLASS)) {
    report(m.index, `clase de la paleta por defecto de Tailwind "${m[0]}"; usa los tokens tb-*`);
  }
  for (const m of text.matchAll(COLOR_PROPERTY)) {
    const valueStart = m.index + m[0].length - m[1].length;
    for (const w of m[1].matchAll(WORD)) {
      if (NAMED_COLORS.has(w[0].toLowerCase())) {
        report(valueStart + w.index, `color con nombre "${w[0]}" fuera de la paleta oficial`);
      }
    }
  }
  return found.sort((a, b) => a.line - b.line || a.column - b.column);
}

/** Archivos de apps/ y packages/ que sigue git (respeta .gitignore: node_modules, dist, etc.). */
function listFiles() {
  const output = execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', 'apps', 'packages'],
    { cwd: ROOT, encoding: 'utf8' },
  );
  return output
    .split('\0')
    .filter((file) => SCANNED_EXTENSIONS.test(file) && !GENERATED.test(file));
}

function main() {
  const files = listFiles();
  let total = 0;
  for (const file of files) {
    for (const v of findViolations(readFileSync(join(ROOT, file), 'utf8'))) {
      console.error(`${file}:${v.line}:${v.column}  ${v.message}`);
      total++;
    }
  }
  if (total > 0) {
    console.error(
      `\n✖ ${total} color(es) fuera de la paleta oficial (doc madre §12.4.1). ` +
        'Solo se permiten var(--color-tb-verde|azul|amarillo|gris|blanco|negro|error), sus clases tb-* y transparent.',
    );
    process.exitCode = 1;
    return;
  }
  console.log(
    `✔ Paleta oficial: ${files.length} archivos revisados, sin colores fuera de la paleta.`,
  );
}

if (import.meta.main) main();
