// DataDian, subetapa 2.2 (ARQUITECTURA_DB_DATADIAN.md §7.4, §7.5 y §10.2): festivos de Colombia, día hábil
// y vencimiento del plazo de reclamo (migración 0010). Patrón de rls.test.ts: pools de una conexión y
// pgErrorOf para leer el SQLSTATE.
import { readFileSync } from 'node:fs';
import { DATADIAN_SQLSTATE } from '@telcobras/contracts';
import { type SQL, sql } from 'drizzle-orm';
import { afterAll, describe, expect, it } from 'vitest';
import type { Database } from '../src/database/database.js';
import { coHolidays, coHolidayYears, radianDeadlineRules } from '../src/database/schema/index.js';
import { appDatabase, ownerDatabase, pgErrorOf, workerDatabase } from './support/database.js';

const app = appDatabase(1);
const worker = workerDatabase(1);
const owner = ownerDatabase();

afterAll(async () => {
  await Promise.all([app.$client.end(), worker.$client.end(), owner.$client.end()]);
});

const rowsOf = async <T extends Record<string, unknown>>(db: Database, query: SQL) =>
  (await db.execute<T>(query)).rows;

/** Vencimiento según radian_deadline, como instante (ms desde la época). */
async function deadline(db: Database, anchor: string, version?: number) {
  // Drizzle entrega timestamptz como texto: se compara el instante en milisegundos.
  const [row] = await rowsOf<{ at: number | null; rule_version: number | null }>(
    db,
    sql`select (extract(epoch from deadline) * 1000)::float8 as at, rule_version
        from app.radian_deadline(${anchor}::timestamptz, 'claim_window', ${version ?? null}::integer)`,
  );
  return { at: row?.at ?? null, ruleVersion: row?.rule_version ?? null };
}

const bogota = (local: string) => new Date(`${local}-05:00`).getTime();

describe('festivos de Colombia (co_holidays_compute y semilla)', () => {
  it('los 18 festivos de 2026 son los del calendario oficial', async () => {
    const expected = [
      '2026-01-01',
      '2026-01-12',
      '2026-03-23',
      '2026-04-02',
      '2026-04-03',
      '2026-05-01',
      '2026-05-18',
      '2026-06-08',
      '2026-06-15',
      '2026-06-29',
      '2026-07-20',
      '2026-08-07',
      '2026-08-17',
      '2026-10-12',
      '2026-11-02',
      '2026-11-16',
      '2026-12-08',
      '2026-12-25',
    ];
    const seeded = await rowsOf<{ day: string }>(
      app,
      sql`select day::text from app.co_holidays
          where day between '2026-01-01' and '2026-12-31' order by day`,
    );
    const computed = await rowsOf<{ day: string }>(
      owner,
      sql`select day::text from app.co_holidays_compute(2026) order by day`,
    );
    expect(seeded.map((row) => row.day)).toEqual(expected);
    expect(computed.map((row) => row.day)).toEqual(expected);
  });

  it('el Domingo de Pascua de 2024 a 2030 es correcto', async () => {
    const rows = await rowsOf<{ year: number; easter: string }>(
      owner,
      sql`select y as year, app.co_easter_sunday(y)::text as easter
          from generate_series(2024, 2030) as y order by y`,
    );
    expect(rows).toEqual([
      { year: 2024, easter: '2024-03-31' },
      { year: 2025, easter: '2025-04-20' },
      { year: 2026, easter: '2026-04-05' },
      { year: 2027, easter: '2027-03-28' },
      { year: 2028, easter: '2028-04-16' },
      { year: 2029, easter: '2029-04-01' },
      { year: 2030, easter: '2030-04-21' },
    ]);
  });

  it('la semilla de 2020 a 2035 coincide con lo calculado y cubre esos años', async () => {
    const diff = await rowsOf<{ day: string; side: string }>(
      owner,
      sql`
        with computed as (
          select h.day, h.name, h.rule from generate_series(2020, 2035) as y,
            lateral app.co_holidays_compute(y) as h
        ), seeded as (select day, name, rule from app.co_holidays)
        select day::text, 'solo calculado' as side from (table computed except table seeded) a
        union all
        select day::text, 'solo sembrado' from (table seeded except table computed) b
        order by 1`,
    );
    expect(diff).toEqual([]);

    const years = await rowsOf<{ year: number; source: string; verified: boolean; days: number }>(
      app,
      sql`select y.year, y.source, y.verified_at is not null as verified,
            (select count(*)::int from app.co_holidays h
             where extract(year from h.day) = y.year) as days
          from app.co_holiday_years y order by y.year`,
    );
    expect(years.map((row) => row.year)).toEqual(Array.from({ length: 16 }, (_, i) => 2020 + i));
    expect(years.every((row) => row.source === 'computed' && !row.verified)).toBe(true);
    // San Pedro y San Pablo coincide con el Sagrado Corazón el 30-jun-2025 y el 1-jul-2030.
    for (const row of years) {
      expect(row.days, String(row.year)).toBe([2025, 2030].includes(row.year) ? 17 : 18);
    }
  });

  // Listas fijas de un oráculo independiente de la función de la 0010 (Pascua por el algoritmo de Knuth,
  // contrastada con las tablas eclesiásticas publicadas): la semilla no se valida solo contra quien la generó.
  const ORACLE: Record<number, string[]> = {
    2025: [
      '2025-01-01',
      '2025-01-06',
      '2025-03-24',
      '2025-04-17',
      '2025-04-18',
      '2025-05-01',
      '2025-06-02',
      '2025-06-23',
      '2025-06-30',
      '2025-07-20',
      '2025-08-07',
      '2025-08-18',
      '2025-10-13',
      '2025-11-03',
      '2025-11-17',
      '2025-12-08',
      '2025-12-25',
    ],
    2030: [
      '2030-01-01',
      '2030-01-07',
      '2030-03-25',
      '2030-04-18',
      '2030-04-19',
      '2030-05-01',
      '2030-06-03',
      '2030-06-24',
      '2030-07-01',
      '2030-07-20',
      '2030-08-07',
      '2030-08-19',
      '2030-10-14',
      '2030-11-04',
      '2030-11-11',
      '2030-12-08',
      '2030-12-25',
    ],
    2035: [
      '2035-01-01',
      '2035-01-08',
      '2035-03-19',
      '2035-03-22',
      '2035-03-23',
      '2035-05-01',
      '2035-05-07',
      '2035-05-28',
      '2035-06-04',
      '2035-07-02',
      '2035-07-20',
      '2035-08-07',
      '2035-08-20',
      '2035-10-15',
      '2035-11-05',
      '2035-11-12',
      '2035-12-08',
      '2035-12-25',
    ],
  };

  it('la semilla de 2025, 2030 y 2035 coincide con listas fijas de un oráculo independiente', async () => {
    for (const [year, expected] of Object.entries(ORACLE)) {
      const seeded = await rowsOf<{ day: string }>(
        app,
        sql`select day::text from app.co_holidays
            where extract(year from day) = ${Number(year)} order by day`,
      );
      expect(
        seeded.map((row) => row.day),
        year,
      ).toEqual(expected);
    }
    expect([ORACLE[2025]?.length, ORACLE[2030]?.length, ORACLE[2035]?.length]).toEqual([
      17, 17, 18,
    ]);
  });

  it('dos festivos el mismo día quedan en una sola fila con los dos nombres', async () => {
    const rows = await rowsOf<{ day: string; name: string; rule: string }>(
      app,
      sql`select day::text, name, rule from app.co_holidays
          where day in ('2025-06-30', '2030-07-01') order by day`,
    );
    expect(rows).toEqual([
      { day: '2025-06-30', name: 'San Pedro y San Pablo y Sagrado Corazón', rule: 'emiliani' },
      { day: '2030-07-01', name: 'San Pedro y San Pablo y Sagrado Corazón', rule: 'emiliani' },
    ]);
  });
});

describe('día hábil (is_business_day)', () => {
  const isBusinessDay = async (db: Database, day: string) => {
    const [row] = await rowsOf<{ ok: boolean }>(
      db,
      sql`select app.is_business_day(${day}::date, '{6,7}') as ok`,
    );
    return row?.ok;
  };

  it('sábado, domingo y festivo no son hábiles; un martes sí', async () => {
    expect(await isBusinessDay(app, '2026-11-14')).toBe(false);
    expect(await isBusinessDay(app, '2026-11-15')).toBe(false);
    expect(await isBusinessDay(app, '2026-11-16')).toBe(false);
    expect(await isBusinessDay(worker, '2026-11-17')).toBe(true);
  });

  it('fuera de los años sembrados falla con DD006', async () => {
    for (const day of ['2019-12-31', '2036-01-02']) {
      const error = await pgErrorOf(isBusinessDay(app, day));
      expect(error.code, day).toBe(DATADIAN_SQLSTATE.calendarNotCovered);
    }
  });
});

describe('vencimiento del plazo (radian_deadline)', () => {
  it('siembra la regla 1 activa (3 días hábiles) y la 2 inactiva (72 horas hábiles)', async () => {
    const rules = await app
      .select({
        version: radianDeadlineRules.version,
        unit: radianDeadlineRules.unit,
        amount: radianDeadlineRules.amount,
        anchorEvent: radianDeadlineRules.anchorEvent,
        anchorField: radianDeadlineRules.anchorField,
        startMode: radianDeadlineRules.startMode,
        cutoffLocal: radianDeadlineRules.cutoffLocal,
        nonWorkingIsodow: radianDeadlineRules.nonWorkingIsodow,
        timezone: radianDeadlineRules.timezone,
        active: radianDeadlineRules.active,
        verified: radianDeadlineRules.verified,
      })
      .from(radianDeadlineRules)
      .orderBy(radianDeadlineRules.version);
    const common = {
      anchorEvent: '032',
      anchorField: 'dian_registered_at',
      cutoffLocal: '23:59:59.999',
      nonWorkingIsodow: [6, 7],
      timezone: 'America/Bogota',
      verified: false,
    };
    expect(rules).toEqual([
      {
        ...common,
        version: 1,
        unit: 'business_days',
        amount: 3,
        startMode: 'next_business_day',
        active: true,
      },
      {
        ...common,
        version: 2,
        unit: 'business_hours',
        amount: 72,
        startMode: 'same_instant',
        active: false,
      },
    ]);
  });

  // Ancla (hora de Bogotá) y vencimiento esperado con cada regla, también en hora de Bogotá.
  const vectors = [
    {
      name: 'ejemplo de §7.4: viernes, fin de semana y lunes festivo intermedio',
      anchor: '2026-11-13T10:00:00',
      days: '2026-11-19T23:59:59.999',
      hours: '2026-11-19T10:00:00',
    },
    {
      name: 'solo fin de semana',
      anchor: '2026-10-22T15:00:00',
      days: '2026-10-27T23:59:59.999',
      hours: '2026-10-27T15:00:00',
    },
    {
      name: 'Semana Santa: jueves y viernes festivos seguidos',
      anchor: '2026-04-01T12:00:00',
      days: '2026-04-08T23:59:59.999',
      hours: '2026-04-08T12:00:00',
    },
    {
      name: 'ancla en festivo (lunes 16-nov-2026)',
      anchor: '2026-11-16T09:00:00',
      days: '2026-11-19T23:59:59.999',
      hours: '2026-11-20T00:00:00',
    },
    {
      name: 'ancla en domingo',
      anchor: '2026-10-25T10:00:00',
      days: '2026-10-28T23:59:59.999',
      hours: '2026-10-29T00:00:00',
    },
    {
      name: 'cruce de año con el 1 de enero festivo',
      anchor: '2026-12-30T14:00:00',
      days: '2027-01-05T23:59:59.999',
      hours: '2027-01-05T14:00:00',
    },
    {
      // 23:59 del jueves en Bogotá ya es viernes en UTC: contar en UTC daría el miércoles 28.
      name: 'ancla a las 23:59 de Bogotá (jueves local, viernes en UTC)',
      anchor: '2026-10-22T23:59:00',
      days: '2026-10-27T23:59:59.999',
      hours: '2026-10-27T23:59:00',
    },
    {
      name: 'ancla a las 23:59 de Bogotá antes de fin de semana y festivo',
      anchor: '2026-11-13T23:59:00',
      days: '2026-11-19T23:59:59.999',
      hours: '2026-11-19T23:59:00',
    },
  ];

  it.each(vectors)('$name', async ({ anchor, days, hours }) => {
    const anchorAt = `${anchor}-05:00`;
    expect(await deadline(app, anchorAt)).toEqual({ at: bogota(days), ruleVersion: 1 });
    expect(await deadline(app, anchorAt, 1)).toEqual({ at: bogota(days), ruleVersion: 1 });
    expect(await deadline(worker, anchorAt, 2)).toEqual({ at: bogota(hours), ruleVersion: 2 });
  });

  it('el ancla se interpreta como instante: la misma hora en UTC da el mismo vencimiento', async () => {
    expect(await deadline(app, '2026-10-23T04:59:00Z')).toEqual(
      await deadline(app, '2026-10-22T23:59:00-05:00'),
    );
  });

  it('un ancla en 2036, o un recorrido que llega a 2036, falla con DD006 con las dos reglas', async () => {
    for (const anchor of ['2036-01-05T10:00:00-05:00', '2035-12-31T12:00:00-05:00']) {
      for (const version of [1, 2] as const) {
        const error = await pgErrorOf(deadline(app, anchor, version));
        expect(error.code, `${anchor} v${version}`).toBe(DATADIAN_SQLSTATE.calendarNotCovered);
      }
    }
  });

  it('sin ancla no hay vencimiento; una versión inexistente falla', async () => {
    const [row] = await rowsOf<{ deadline: Date | null; rule_version: number | null }>(
      app,
      sql`select * from app.radian_deadline(null)`,
    );
    expect(row).toEqual({ deadline: null, rule_version: null });
    expect((await pgErrorOf(deadline(app, '2026-11-13T10:00:00-05:00', 3))).code).toBe('P0002');
  });
});

describe('privilegios de las tablas y funciones globales', () => {
  const writes = (db: Database) => [
    db
      .insert(coHolidays)
      .values({ day: '2026-11-17', name: 'Intruso', rule: 'manual', legalBasis: 'x' }),
    db.update(coHolidays).set({ name: 'Cambiado' }),
    db.delete(coHolidays),
    db.insert(coHolidayYears).values({ year: 2036, source: 'manual' }),
    db.update(coHolidayYears).set({ source: 'manual' }),
    db.delete(coHolidayYears),
    db.update(radianDeadlineRules).set({ active: false }),
    db.delete(radianDeadlineRules),
    db.execute(sql`truncate app.co_holidays`),
  ];

  for (const [role, db] of [
    ['app_user', app],
    ['app_worker', worker],
  ] as const) {
    it(`${role} lee las tablas globales pero no puede escribir en ellas (42501)`, async () => {
      const [row] = await db.select({ day: coHolidays.day }).from(coHolidays).limit(1);
      expect(row).toBeDefined();
      for (const write of writes(db)) {
        expect(await pgErrorOf(write)).toMatchObject({
          code: '42501',
          message: expect.stringMatching(/permission denied/),
        });
      }
    });
  }

  it('app_user y app_worker tienen exactamente SELECT sobre las tablas globales', async () => {
    const rows = await rowsOf<{ relname: string; role: string; privileges: string[] }>(
      owner,
      sql`select c.relname, r.role,
            array(select p from unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE',
                                             'REFERENCES', 'TRIGGER']) as p
                  where has_table_privilege(r.role, c.oid, p)) as privileges
          from pg_class c join pg_namespace n on n.oid = c.relnamespace
          cross join (values ('app_user'), ('app_worker')) as r (role)
          where n.nspname = 'app'
            and c.relname in ('co_holidays', 'co_holiday_years', 'radian_deadline_rules')
          order by c.relname, r.role`,
    );
    expect(rows).toHaveLength(6);
    for (const row of rows)
      expect(row.privileges, `${row.role} ${row.relname}`).toEqual(['SELECT']);
    // Ni privilegios por columna de escritura.
    const [columns] = await rowsOf<{ writable: boolean }>(
      owner,
      sql`select bool_or(has_any_column_privilege(r.role, c.oid, 'INSERT, UPDATE, REFERENCES')) as writable
          from pg_class c join pg_namespace n on n.oid = c.relnamespace
          cross join (values ('app_user'), ('app_worker')) as r (role)
          where n.nspname = 'app'
            and c.relname in ('co_holidays', 'co_holiday_years', 'radian_deadline_rules')`,
    );
    expect(columns?.writable).toBe(false);
  });

  it('app_user y app_worker solo ejecutan is_business_day y radian_deadline', async () => {
    const rows = await rowsOf<{ proname: string; app_user: boolean; app_worker: boolean }>(
      owner,
      sql`select p.proname,
            has_function_privilege('app_user', p.oid, 'EXECUTE') as app_user,
            has_function_privilege('app_worker', p.oid, 'EXECUTE') as app_worker
          from pg_proc p join pg_namespace n on n.oid = p.pronamespace
          where n.nspname = 'app' order by p.proname`,
    );
    const calendar = [
      'co_easter_sunday',
      'co_holidays_compute',
      'is_business_day',
      'radian_deadline',
    ];
    expect(rows.filter((row) => calendar.includes(row.proname))).toEqual([
      { proname: 'co_easter_sunday', app_user: false, app_worker: false },
      { proname: 'co_holidays_compute', app_user: false, app_worker: false },
      { proname: 'is_business_day', app_user: true, app_worker: true },
      { proname: 'radian_deadline', app_user: true, app_worker: true },
    ]);
    // Inventario de todo el esquema: las demás funciones (disparadores, recálculo) quedan para app_owner.
    // telco_backoff (0015) es la única otra que ejecutan los roles de la aplicación (§9.3).
    const executable = rows
      .filter((row) => row.app_user || row.app_worker)
      .map((row) => row.proname);
    expect(executable.filter((name) => !calendar.includes(name))).toEqual(
      rows.some((row) => row.proname === 'telco_backoff') ? ['telco_backoff'] : [],
    );
    expect(
      (await pgErrorOf(app.execute(sql`select * from app.co_holidays_compute(2026)`))).code,
    ).toBe('42501');
  });

  it('una sola versión activa por regla y solo combinaciones de unidad e inicio definidas', async () => {
    // Como app_owner, dentro de una transacción que siempre se deshace.
    const rollback = new Error('rollback');
    const attempt = (query: SQL) =>
      pgErrorOf(
        owner.transaction(async (tx) => {
          await tx.execute(query);
          throw rollback;
        }),
      );
    const insertRule = (version: number, unit: string, startMode: string, active: boolean) =>
      sql`insert into app.radian_deadline_rules
            (key, version, unit, amount, anchor_event, anchor_field, start_mode, active, source)
          values ('claim_window', ${version}, ${unit}, 3, '032', 'dian_registered_at', ${startMode},
            ${active}, 'prueba')`;
    expect((await attempt(insertRule(9, 'business_days', 'next_business_day', true))).code).toBe(
      '23505',
    );
    expect((await attempt(insertRule(9, 'business_days', 'same_instant', false))).code).toBe(
      '23514',
    );
    expect((await attempt(insertRule(9, 'business_hours', 'next_business_day', false))).code).toBe(
      '23514',
    );
    expect(await attempt(insertRule(9, 'business_hours', 'same_instant', false))).toBe(rollback);
  });
});

describe('reverso de la 0010 (§10.1)', () => {
  it('se aplica, deja la base sin el calendario y la 0010 se vuelve a aplicar', async () => {
    const folder = new URL('../src/database/migrations/', import.meta.url);
    const reverse = readFileSync(new URL('0010_datadian_calendar.reverse.sql', folder), 'utf8');
    const forward = readFileSync(new URL('0010_datadian_calendar.sql', folder), 'utf8');
    const objects = `select
        to_regclass('app.co_holidays') is not null as co_holidays,
        to_regclass('app.co_holiday_years') is not null as co_holiday_years,
        to_regclass('app.radian_deadline_rules') is not null as radian_deadline_rules,
        to_regprocedure('app.radian_deadline(timestamptz, text, integer)') is not null as radian_deadline,
        to_regprocedure('app.is_business_day(date, smallint[])') is not null as is_business_day,
        to_regprocedure('app.co_holidays_compute(integer)') is not null as co_holidays_compute,
        to_regprocedure('app.co_easter_sunday(integer)') is not null as co_easter_sunday`;
    const none = {
      co_holidays: false,
      co_holiday_years: false,
      radian_deadline_rules: false,
      radian_deadline: false,
      is_business_day: false,
      co_holidays_compute: false,
      co_easter_sunday: false,
    };

    // Cliente propio para correr los archivos completos (varias sentencias) en una transacción.
    const client = await owner.$client.connect();
    try {
      await client.query('begin');
      await client.query(reverse);
      expect((await client.query(objects)).rows[0]).toEqual(none);

      await client.query(forward);
      const [state] = (await client.query(objects)).rows;
      expect(Object.values(state)).toEqual(Object.values(none).map(() => true));
      const holidays = await client.query(
        "select count(*)::int as n from app.co_holidays where day between '2026-01-01' and '2026-12-31'",
      );
      expect(holidays.rows[0]).toEqual({ n: 18 });
      const grants = await client.query(
        `select has_table_privilege('app_worker', 'app.co_holidays', 'SELECT') as worker_select,
                has_function_privilege('app_user', 'app.radian_deadline(timestamptz, text, integer)', 'EXECUTE') as user_execute,
                has_function_privilege('app_user', 'app.co_holidays_compute(integer)', 'EXECUTE') as user_compute`,
      );
      expect(grants.rows[0]).toEqual({
        worker_select: true,
        user_execute: true,
        user_compute: false,
      });
    } finally {
      await client.query('rollback');
      client.release();
    }
  });
});
