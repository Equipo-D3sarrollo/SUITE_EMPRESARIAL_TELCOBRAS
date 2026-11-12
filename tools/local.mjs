// Levanta todo el proyecto en local con un solo comando: pnpm local
// Pasos: .env → dependencias → Docker Desktop → infraestructura (Compose) → migraciones → semillas → pnpm dev.
// Detener: Ctrl+C corta web/API; `pnpm local:stop` apaga los contenedores (los datos se conservan).
// Opciones: --skip-install (no revisa dependencias), --no-dev (deja todo listo sin arrancar web/API).
import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ENV_FILE = join(ROOT, '.env');
const COMPOSE = ['compose', '-f', 'infra/compose/docker-compose.yml', '--env-file', '.env'];
const args = new Set(process.argv.slice(2));
const isWindows = process.platform === 'win32';

const step = (msg) => console.log(`\n\x1b[36m▶ ${msg}\x1b[0m`);
const ok = (msg) => console.log(`\x1b[32m✔ ${msg}\x1b[0m`);
const warn = (msg) => console.log(`\x1b[33m⚠ ${msg}\x1b[0m`);
const fail = (msg) => {
  console.error(`\x1b[31m✖ ${msg}\x1b[0m`);
  process.exit(1);
};

// shell en Windows para resolver pnpm.cmd; los argumentos son fijos, sin entrada del usuario.
const run = (cmd, cmdArgs, opts = {}) =>
  spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: 'inherit', shell: isWindows, ...opts }).status === 0;
const quiet = (cmd, cmdArgs) =>
  spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: 'ignore', shell: isWindows }).status === 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readEnv() {
  const env = {};
  for (const line of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

async function ensureDocker() {
  if (quiet('docker', ['info'])) return ok('Docker está activo');
  if (!quiet('docker', ['--version'])) fail('Docker no está instalado. Instala Docker Desktop.');

  const candidates = isWindows
    ? [
        join(
          process.env.ProgramFiles ?? 'C:\\Program Files',
          'Docker',
          'Docker',
          'Docker Desktop.exe',
        ),
        join(process.env.LOCALAPPDATA ?? '', 'Programs', 'DockerDesktop', 'Docker Desktop.exe'),
      ]
    : [];
  const exe = candidates.find((p) => existsSync(p));
  if (exe) {
    warn('Docker no responde; iniciando Docker Desktop…');
    spawn(exe, [], { detached: true, stdio: 'ignore' }).unref();
  } else if (process.platform === 'darwin') {
    warn('Docker no responde; iniciando Docker Desktop…');
    quiet('open', ['-a', 'Docker']);
  } else {
    fail('Docker no responde. Inicia Docker Desktop (o el servicio docker) y vuelve a intentar.');
  }

  for (let i = 0; i < 90; i++) {
    await sleep(2000);
    if (quiet('docker', ['info'])) return ok('Docker está activo');
  }
  fail('Docker no respondió en 3 minutos. Ábrelo manualmente y vuelve a ejecutar pnpm local.');
}

// --- 1. .env ---
step('Variables de entorno');
if (!existsSync(ENV_FILE)) {
  copyFileSync(join(ROOT, '.env.example'), ENV_FILE);
  ok('.env creado desde .env.example');
} else ok('.env encontrado');

const env = readEnv();
const pgPort = env.POSTGRES_PORT || '5432';
for (const key of ['DATABASE_URL', 'DATABASE_OWNER_URL', 'DATABASE_WORKER_URL']) {
  const port = env[key]?.match(/@[^:/]+:(\d+)\//)?.[1];
  if (port && port !== pgPort) {
    fail(`${key} usa el puerto ${port} pero POSTGRES_PORT es ${pgPort}. Iguálalos en .env.`);
  }
}

// --- 2. Dependencias ---
if (!args.has('--skip-install')) {
  step('Dependencias (pnpm install)');
  if (!run('pnpm', ['install', '--frozen-lockfile'])) fail('pnpm install falló.');
}

// --- 3. Docker + infraestructura ---
step('Docker');
await ensureDocker();

step(`Infraestructura: PostgreSQL (:${pgPort}), Valkey, SeaweedFS, Mailpit`);
if (!run('docker', [...COMPOSE, 'up', '-d', '--wait'])) {
  fail(
    `Compose no pudo levantar los servicios. Si el puerto ${pgPort} está ocupado (p. ej. por un ` +
      'PostgreSQL de Windows), define POSTGRES_PORT=5433 en .env y ajusta el puerto de DATABASE_URL, ' +
      'DATABASE_OWNER_URL y DATABASE_WORKER_URL.',
  );
}
ok('Servicios saludables');

// --- 4. Base de datos ---
// Rol de Telco: init.sql lo crea en volúmenes nuevos; en uno anterior lo agrega este script idempotente.
// La migración 0010 falla si el rol no existe.
step('Rol app_worker (idempotente)');
if (!env.APP_WORKER_PASSWORD || !env.DATABASE_WORKER_URL) {
  fail('Faltan APP_WORKER_PASSWORD y DATABASE_WORKER_URL en .env. Cópialas de .env.example.');
}
const workerRole = spawnSync(
  'docker',
  [
    ...COMPOSE,
    'exec',
    '-T',
    '-e',
    `APP_WORKER_PASSWORD=${env.APP_WORKER_PASSWORD}`,
    'postgres',
    'psql',
    '-U',
    'postgres',
    '-d',
    'telcobras',
    '-q',
    '-f',
    '-',
  ],
  {
    cwd: ROOT,
    input: readFileSync(join(ROOT, 'infra/compose/postgres/app-worker.sql')),
    stdio: ['pipe', 'ignore', 'inherit'],
  },
);
if (workerRole.status !== 0) fail('No se pudo crear o ajustar el rol app_worker.');
ok('Rol app_worker listo');
step('Migraciones');
if (!run('pnpm', ['db:migrate'])) fail('Las migraciones fallaron.');
step('Semillas (idempotentes)');
if (!run('pnpm', ['db:seed'])) fail('Las semillas fallaron.');
ok('Base de datos lista');

const urls = [
  ['Web', 'http://localhost:5173'],
  ['API', `http://localhost:${env.API_PORT || '3000'}/api/v1`],
  ['OpenAPI', `http://localhost:${env.API_PORT || '3000'}/api/v1/docs`],
  ['Mailpit', 'http://localhost:8025'],
];
console.log(`\n${urls.map(([n, u]) => `  ${n.padEnd(8)} ${u}`).join('\n')}`);

if (args.has('--no-dev')) {
  ok('Todo listo. Arranca web/API con: pnpm dev');
  process.exit(0);
}

// --- 5. Web + API ---
step('Arrancando web y API (Ctrl+C para detener; pnpm local:stop apaga los contenedores)');
const dev = spawn('pnpm', ['dev'], { cwd: ROOT, stdio: 'inherit', shell: isWindows });
dev.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGINT', () => {});
