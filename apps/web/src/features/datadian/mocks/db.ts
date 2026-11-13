import {
  computeNitCheckDigit,
  type DatadianErrorCode,
  type DatadianHealth,
  type DianCertificate,
  type DianReadiness,
  type DianSettings,
  type DianSettingsInput,
  type ImapMailbox,
  type ImapMailboxInput,
  type OdooConnection,
  type RadianEventRequest,
  type RadianInvoiceDetail,
  type RadianRules,
  type RadianStatus,
  type RadianSummary,
  type ReceivedDocumentHistoryEntry,
  radianSequenceViolation,
  SEED_RADIAN_EVENT_RULES,
  type SyncRun,
  type SyncRunRequest,
  type TelcoJob,
} from '@telcobras/contracts';
import {
  addBusinessDays,
  businessDaysBetween,
  createRandom,
  type EventRecord,
  FICTITIOUS_TRACE,
  type InvoiceRecord,
  MOCK_ORG_NIT,
  MOCK_USER,
  makeCertificate,
  makeEvent,
  makeInvoices,
  makeJob,
  makeMailbox,
  makeSyncRun,
  makeXml,
} from './fixtures';

/**
 * Motor de escenarios de los mocks (§4.2): estado en memoria y reloj controlable. Simula lo que harán
 * Telco y la DIAN sin temporizadores: cada lectura llama a `tick()`, que resuelve lo que ya "venció"
 * según el reloj. Determinista con la semilla.
 */
export type MockDbOptions = {
  seed?: number;
  /** Cuánto tarda la DIAN en responder un evento (por defecto 2 s). */
  latencyMs?: number;
  /** Cuánto tarda Telco en validar un certificado (por defecto 3 s). */
  certificateLatencyMs?: number;
};

export class MockError extends Error {
  constructor(
    readonly code: DatadianErrorCode | 'NOT_FOUND' | 'BAD_REQUEST',
    readonly status = 400,
  ) {
    super(code);
  }
}

const DAY = 86_400_000;
const iso = (ms: number) => new Date(ms).toISOString();
const ACCEPTED_STATUS: Partial<Record<string, RadianStatus>> = {
  '030': 'acknowledged',
  '032': 'goods_received',
  '031': 'claimed',
  '033': 'accepted_express',
  '034': 'accepted_tacit',
};

export function createMockDb(options: MockDbOptions = {}) {
  const random = createRandom(options.seed ?? 20261113);
  const latency = options.latencyMs ?? 2_000;
  const certificateLatency = options.certificateLatencyMs ?? 3_000;
  let offset = 0;
  const now = () => Date.now() + offset;
  const start = now();

  const invoices = new Map<string, InvoiceRecord>(
    makeInvoices(random, start).map((record) => [record.invoice.id, record]),
  );
  const idempotency = new Map<string, EventRecord>();
  const history = new Map<string, ReceivedDocumentHistoryEntry[]>();

  const activeCertificate = makeCertificate(random, start, { isActive: true });
  const certificates: (DianCertificate & { resolveAt?: number; outcome?: string })[] = [
    activeCertificate,
    makeCertificate(random, start - 400 * DAY, {
      status: 'retired',
      notAfter: iso(start - 30 * DAY),
      daysToExpiry: null,
      expiryState: null,
      retiredAt: iso(start - 200 * DAY),
    }),
  ];
  let settings: DianSettings = {
    nit: MOCK_ORG_NIT,
    nitDv: String(computeNitCheckDigit(MOCK_ORG_NIT)),
    environment: '2',
    operationMode: 'own_software',
    softwareId: random.uuid(),
    softwarePinSet: true,
    testSetId: null,
    activeCertificateId: activeCertificate.id,
    rpaEnabled: true,
    imapEnabled: true,
    syncLookbackDays: 30,
    updatedAt: iso(start - 10 * DAY),
  };
  let odoo: OdooConnection | null = {
    baseUrl: 'https://organizacion.odoo.example',
    database: 'produccion',
    updatedAt: iso(start - 20 * DAY),
  };
  const mailboxes: ImapMailbox[] = [makeMailbox(random, start)];
  const runs: (SyncRun & { startAt?: number; finishAt?: number })[] = [
    makeSyncRun(random, start - 2 * 3_600_000),
    makeSyncRun(random, start - 26 * 3_600_000, {
      status: 'partial',
      listedCount: 0,
      newCount: 0,
      existingCount: 0,
      xmlDownloadedCount: 0,
      emptyListingWarning: true,
    }),
    makeSyncRun(random, start - 50 * 3_600_000, {
      status: 'failed',
      listedCount: 0,
      newCount: 0,
      existingCount: 0,
      xmlDownloadedCount: 0,
      humanVerificationRequired: true,
      errorMessage: 'El portal pidió una verificación humana (ejemplo).',
    }),
    makeSyncRun(random, start - 3 * 3_600_000, {
      channel: 'imap',
      mailboxId: mailboxes[0]?.id ?? null,
      listedCount: 4,
      newCount: 1,
      existingCount: 3,
      xmlDownloadedCount: 1,
    }),
    makeSyncRun(random, start - 5 * DAY, {
      channel: 'manual',
      trigger: 'user',
      requestedBy: MOCK_USER,
      listedCount: 1,
      newCount: 1,
      existingCount: 0,
      xmlDownloadedCount: 1,
    }),
  ];
  const firstInvoice = [...invoices.values()][0]?.invoice;
  const jobs: TelcoJob[] = [
    makeJob(random, start - 3_600_000, {
      resource: firstInvoice
        ? {
            type: 'received_document',
            id: firstInvoice.id,
            label: `${firstInvoice.prefix}${firstInvoice.folio}`,
          }
        : null,
    }),
    makeJob(random, start - 7_200_000, {
      kind: 'radian_event_send',
      lastError: 'Intentos agotados: error de transporte con el web service (ejemplo).',
    }),
    makeJob(random, start + 600_000, {
      kind: 'certificate_check',
      status: 'queued',
      attempts: 0,
      lastError: null,
      lastErrorAt: null,
    }),
  ];

  // ---- Reloj y resolución de lo pendiente ----

  function applyAccepted(record: InvoiceRecord, event: EventRecord, at: number) {
    const invoice = record.invoice;
    invoice.acceptedEventCodes = [...invoice.acceptedEventCodes, event.eventCode];
    invoice.radianStatus = ACCEPTED_STATUS[event.eventCode] ?? invoice.radianStatus;
    invoice.radianStatusAt = iso(at);
    if (event.eventCode === '032') {
      invoice.deadline = {
        ...invoice.deadline,
        claimDeadlineAt: iso(addBusinessDays(at, 3)),
        ruleVersion: 1,
      };
    }
    if (event.eventCode === '033' || event.eventCode === '034') invoice.notesBlocked = true;
  }

  function resolveEvent(record: InvoiceRecord, event: EventRecord) {
    const at = event.resolveAt ?? now();
    delete event.resolveAt;
    const attempt = {
      attemptNo: 1,
      startedAt: event.sentAt ?? iso(at),
      finishedAt: iso(at),
      httpStatus: 200,
      durationMs: 900,
    };
    event.attempts = 1;
    if (record.scenario === 'dian-rejects') {
      record.scenario = undefined;
      Object.assign(event, {
        status: 'rejected',
        dianStatusCode: '04',
        errorMessage: 'La DIAN rechazó el evento (ejemplo ficticio).',
        errorTrace: FICTITIOUS_TRACE,
        hasResponseXml: true,
        attemptsLog: [
          { ...attempt, outcome: 'rejected', dianStatusCode: '04', errorTrace: FICTITIOUS_TRACE },
        ],
      });
    } else if (record.scenario === 'telco-fails') {
      record.scenario = undefined;
      Object.assign(event, {
        status: 'failed',
        errorMessage: 'Intentos agotados: no hubo respuesta del web service (ejemplo).',
        attemptsLog: [
          {
            ...attempt,
            httpStatus: null,
            outcome: 'timeout',
            dianStatusCode: null,
            errorTrace: [],
          },
        ],
      });
    } else {
      Object.assign(event, {
        status: 'accepted',
        cude: random.hex(96),
        dianRegisteredAt: iso(at),
        dianStatusCode: '02',
        hasResponseXml: true,
        attemptsLog: [{ ...attempt, outcome: 'accepted', dianStatusCode: '02', errorTrace: [] }],
      });
      applyAccepted(record, event, at);
    }
    record.invoice.pendingEvent = null;
  }

  function tick() {
    const current = now();
    for (const record of invoices.values()) {
      for (const event of record.events) {
        if (event.status === 'pending' && event.resolveAt !== undefined) {
          if (!event.sentAt && current >= event.resolveAt - latency / 2) {
            event.sentAt = iso(current);
            event.generatedAt = iso(current);
          }
          if (current >= event.resolveAt) resolveEvent(record, event);
        }
      }
      const deadline = record.invoice.deadline.claimDeadlineAt;
      if (
        record.scenario === 'tacit-acceptance' &&
        record.invoice.radianStatus === 'goods_received' &&
        deadline &&
        current > new Date(deadline).getTime()
      ) {
        record.scenario = undefined;
        const event = makeEvent(random, record.invoice.id, '034', current);
        record.events.push(event);
        applyAccepted(record, event, current);
      }
    }
    for (const certificate of certificates) {
      if (certificate.resolveAt !== undefined && current >= certificate.resolveAt) {
        resolveCertificate(certificate);
      }
    }
    for (const run of runs) {
      if (run.status === 'queued' && run.startAt !== undefined && current >= run.startAt) {
        run.status = 'running';
        run.startedAt = iso(run.startAt);
      }
      if (run.status === 'running' && run.finishAt !== undefined && current >= run.finishAt) {
        Object.assign(run, {
          status: 'succeeded',
          finishedAt: iso(run.finishAt),
          listedCount: run.channel === 'manual' ? 1 : 12,
          newCount: run.channel === 'manual' ? 1 : 2,
          existingCount: run.channel === 'manual' ? 0 : 10,
          xmlDownloadedCount: run.channel === 'manual' ? 1 : 2,
        });
        delete run.startAt;
        delete run.finishAt;
      }
    }
  }

  // ---- Vistas derivadas ----

  /** Estado del plazo como la vista `received_documents_radian`. */
  function view(record: InvoiceRecord): RadianInvoiceDetail {
    const invoice = record.invoice;
    const deadlineAt = invoice.deadline.claimDeadlineAt;
    let state: RadianInvoiceDetail['deadline']['state'] = 'none';
    let remaining: number | null = null;
    if (invoice.radianStatus === 'goods_received' && deadlineAt) {
      const left = new Date(deadlineAt).getTime() - now();
      state = left < 0 ? 'expired' : left < DAY ? 'due_soon' : 'open';
      remaining = left < 0 ? 0 : businessDaysBetween(now(), new Date(deadlineAt).getTime());
    }
    return structuredClone({
      ...invoice,
      deadline: { ...invoice.deadline, state, businessDaysRemaining: remaining },
    });
  }

  const find = (id: string) => {
    tick();
    const record = invoices.get(id);
    if (!record) throw new MockError('NOT_FOUND', 404);
    return record;
  };

  // ---- Facturas ----

  function list(query: {
    from?: string;
    to?: string;
    q?: string;
    radianStatus?: string[];
    deadlineState?: string;
    validationStatus?: string;
    ingestionSource?: string;
    paymentForm?: string;
    sort: string;
    cursor?: string;
    limit: number;
  }) {
    tick();
    let items = [...invoices.values()].map(view);
    if (query.from) items = items.filter((i) => (i.issueDate ?? '') >= (query.from ?? ''));
    if (query.to) items = items.filter((i) => (i.issueDate ?? '') <= (query.to ?? ''));
    if (query.q) {
      const q = query.q.toLowerCase();
      items = items.filter((i) =>
        q.length === 96 ? i.cufe === q : (i.issuerNit ?? '').replace(/\D/g, '').startsWith(q),
      );
    }
    if (query.radianStatus) {
      const wanted = new Set(query.radianStatus);
      items = items.filter((i) => wanted.has(i.radianStatus));
    }
    if (query.deadlineState) items = items.filter((i) => i.deadline.state === query.deadlineState);
    if (query.validationStatus) {
      items = items.filter((i) => i.validationStatus === query.validationStatus);
    }
    if (query.ingestionSource)
      items = items.filter((i) => i.ingestionSource === query.ingestionSource);
    if (query.paymentForm) items = items.filter((i) => i.paymentForm === query.paymentForm);
    items.sort((a, b) =>
      query.sort === 'deadline_asc'
        ? (a.deadline.claimDeadlineAt ?? '').localeCompare(b.deadline.claimDeadlineAt ?? '')
        : (b.issueDate ?? '').localeCompare(a.issueDate ?? '') || a.id.localeCompare(b.id),
    );
    const offsetIndex = Number(query.cursor ?? 0);
    const page = items.slice(offsetIndex, offsetIndex + query.limit);
    const next = offsetIndex + query.limit;
    return { items: page, nextCursor: next < items.length ? String(next) : null };
  }

  function summary(): RadianSummary {
    tick();
    const all = [...invoices.values()].map(view);
    const count = <K extends string>(keys: readonly K[], of: (item: RadianInvoiceDetail) => K) =>
      Object.fromEntries(
        keys.map((key) => [key, all.filter((item) => of(item) === key).length]),
      ) as Record<K, number>;
    return {
      byRadianStatus: count(
        ['none', 'acknowledged', 'goods_received', 'claimed', 'accepted_express', 'accepted_tacit'],
        (item) => item.radianStatus,
      ),
      byDeadlineState: count(
        ['none', 'open', 'due_soon', 'expired'],
        (item) => item.deadline.state,
      ),
      byValidationStatus: count(
        ['pending_xml', 'pending_validation', 'valid', 'invalid'],
        (item) => item.validationStatus,
      ),
      expiredWithoutDecision: all.filter((item) => item.deadline.state === 'expired').length,
      withProblems:
        all.filter((item) => item.validationStatus === 'invalid').length +
        jobs.filter((job) => job.status === 'dead').length,
      legacy: {
        byStatus: count(['imported', 'draft', 'approved', 'rejected'], (item) => item.status),
        odooFailed: all.filter((item) => item.odoo?.status === 'failed').length,
        pendingTotal: all
          .filter((item) => item.status === 'imported' || item.status === 'draft')
          .reduce((sum, item) => sum + Number(item.total ?? 0), 0)
          .toFixed(2),
      },
    };
  }

  const rules: RadianRules = {
    events: [...SEED_RADIAN_EVENT_RULES],
    deadline: {
      version: 1,
      businessDays: 3,
      verified: false,
      source:
        'Blueprint DataDian (por verificar: Código de Comercio art. 773 y Decreto 1154 de 2020)',
    },
  };

  function certificateValid() {
    const active = certificates.find(
      (certificate) => certificate.id === settings.activeCertificateId,
    );
    return Boolean(active && active.status === 'valid' && (active.daysToExpiry ?? 0) > 0);
  }

  function requestEvent(id: string, body: RadianEventRequest, key: string) {
    const record = find(id);
    const previous = idempotency.get(key);
    if (previous) return structuredClone(previous);
    const invoice = record.invoice;
    if (invoice.validationStatus !== 'valid') throw new MockError('DD007', 422);
    if (invoice.profileExecutionId !== settings.environment) throw new MockError('DD008', 422);
    if (!certificateValid()) throw new MockError('DD010', 422);
    if (!settings.softwareId || !settings.softwarePinSet) {
      throw new MockError('API_SOFTWARE_MISSING', 422);
    }
    if (
      record.events.some(
        (event) => event.status === 'pending' && event.eventCode === body.eventCode,
      )
    ) {
      throw new MockError('API_EVENT_IN_PROGRESS', 409);
    }
    const violation = radianSequenceViolation(
      body.eventCode,
      invoice.acceptedEventCodes,
      rules.events,
    );
    if (violation) throw new MockError(violation, 409);
    const created = now();
    const event = makeEvent(random, id, body.eventCode, created, {
      status: 'pending',
      origin: 'suite',
      cude: null,
      generatedAt: null,
      sentAt: null,
      dianRegisteredAt: null,
      dianStatusCode: null,
      attempts: 0,
      hasResponseXml: false,
      createdAt: iso(created),
      attemptsLog: [],
      claimCode: body.eventCode === '031' ? body.claimCode : null,
      claimNote: body.eventCode === '031' ? (body.claimNote ?? null) : null,
    });
    event.resolveAt = created + latency;
    record.events.push(event);
    invoice.pendingEvent = { id: event.id, eventCode: body.eventCode, since: iso(created) };
    idempotency.set(key, event);
    if (latency === 0) tick();
    const { resolveAt: _resolve, attemptsLog: _log, ...response } = event;
    return structuredClone(response);
  }

  // ---- Configuración ----

  function readiness(): DianReadiness {
    const items: DianReadiness['items'] = [
      { item: 'certificate_active', ok: certificateValid() },
      { item: 'xml_query_ok', ok: true },
      { item: 'status_query_ok', ok: true },
      {
        item: 'test_event_registered',
        ok: false,
        detail: 'Registre un 030 de prueba en habilitación (dato simulado).',
      },
      { item: 'portal_access', ok: true },
    ];
    return { ready: items.every((item) => item.ok), items };
  }

  function saveSettings(input: DianSettingsInput) {
    if (input.environment === '1' && settings.environment !== '1' && !readiness().ready) {
      throw new MockError('API_PRODUCTION_NOT_READY', 422);
    }
    const { softwarePin, ...rest } = input;
    settings = {
      ...settings,
      ...rest,
      softwarePinSet: settings.softwarePinSet || Boolean(softwarePin),
      updatedAt: iso(now()),
    };
    return structuredClone(settings);
  }

  function resolveCertificate(certificate: (typeof certificates)[number]) {
    const failing: Record<string, string> = {
      vencido: 'validity',
      'otro-nit': 'nit_match',
      'sin-no-repudio': 'key_usage_purposes',
    };
    const failed = certificate.outcome ? failing[certificate.outcome] : undefined;
    const days = certificate.outcome === 'por-vencer' ? 89 : failed === 'validity' ? -10 : 365;
    certificate.checks = certificate.checks.map((check) => ({
      ...check,
      status: check.check === failed ? 'failed' : 'ok',
      ...(check.check === failed
        ? { detail: 'Detalle de ejemplo de la validación de Telco.' }
        : {}),
    }));
    certificate.status = failed ? 'invalid' : 'valid';
    certificate.daysToExpiry = days;
    certificate.expiryState = days < 0 ? 'expired' : days <= 90 ? 'due_soon' : 'ok';
    certificate.notAfter = iso(now() + days * DAY);
    certificate.subjectNit = failed === 'nit_match' ? '800999999' : MOCK_ORG_NIT;
    certificate.validatedAt = iso(now());
    delete certificate.resolveAt;
    delete certificate.outcome;
  }

  async function uploadCertificate(file: File) {
    if (!/\.(pfx|p12)$/i.test(file.name) || file.size === 0 || file.size > 65_536) {
      throw new MockError('API_BAD_FILE', 400);
    }
    const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
    const sha = [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
    if (certificates.some((certificate) => certificate.pfxSha256 === sha)) {
      throw new MockError('API_DUPLICATE_CERTIFICATE', 409);
    }
    const outcome = ['vencido', 'otro-nit', 'sin-no-repudio', 'por-vencer'].find((name) =>
      file.name.toLowerCase().includes(name),
    );
    const certificate = {
      ...makeCertificate(random, now(), {
        status: 'pending_validation',
        pfxSha256: sha,
        pfxSizeBytes: file.size,
        checks: makeCertificate(random, now()).checks.map((check) => ({
          ...check,
          status: 'pending' as const,
        })),
        daysToExpiry: null,
        expiryState: null,
        validatedAt: null,
        createdAt: iso(now()),
      }),
      resolveAt: now() + certificateLatency,
      outcome,
    };
    certificates.unshift(certificate);
    if (certificateLatency === 0) tick();
    return publicCertificate(certificate);
  }

  const publicCertificate = ({
    resolveAt: _r,
    outcome: _o,
    ...certificate
  }: (typeof certificates)[number]) => structuredClone(certificate);

  function activateCertificate(id: string) {
    tick();
    const certificate = certificates.find((item) => item.id === id);
    if (!certificate) throw new MockError('NOT_FOUND', 404);
    if (certificate.status !== 'valid' || certificate.subjectNit !== settings.nit) {
      throw new MockError('DD010', 422);
    }
    for (const item of certificates) item.isActive = item.id === id;
    settings = { ...settings, activeCertificateId: id, updatedAt: iso(now()) };
    return structuredClone(settings);
  }

  function retireCertificate(id: string) {
    const certificate = certificates.find((item) => item.id === id);
    if (!certificate) throw new MockError('NOT_FOUND', 404);
    if (certificate.isActive) throw new MockError('API_CERTIFICATE_ACTIVE', 409);
    certificate.status = 'retired';
    certificate.retiredAt = iso(now());
    return publicCertificate(certificate);
  }

  function saveMailbox(id: string | null, input: ImapMailboxInput) {
    const values = {
      host: input.host,
      port: input.port ?? 993,
      useTls: input.useTls ?? true,
      username: input.username,
      authMethod: input.authMethod,
      folder: input.folder ?? 'INBOX',
      enabled: input.enabled ?? true,
    };
    if (id === null) {
      if (mailboxes.some((m) => m.host === values.host && m.username === values.username)) {
        throw new MockError('API_DUPLICATE_MAILBOX', 409);
      }
      const mailbox: ImapMailbox = {
        id: random.uuid(),
        ...values,
        secretSet: Boolean(input.secret),
        lastSyncAt: null,
        updatedAt: iso(now()),
      };
      mailboxes.push(mailbox);
      return structuredClone(mailbox);
    }
    const mailbox = mailboxes.find((item) => item.id === id);
    if (!mailbox) throw new MockError('NOT_FOUND', 404);
    Object.assign(mailbox, values, {
      secretSet: mailbox.secretSet || Boolean(input.secret),
      updatedAt: iso(now()),
    });
    return structuredClone(mailbox);
  }

  // ---- Sincronizaciones y cola ----

  function syncStatus() {
    tick();
    const channels = (['rpa', 'imap', 'manual'] as const).map((channel) => {
      const lastRun =
        runs
          .filter((run) => run.channel === channel)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
      const enabled =
        channel === 'rpa' ? settings.rpaEnabled : channel === 'imap' ? settings.imapEnabled : true;
      return {
        channel,
        enabled,
        lastRun: lastRun ? publicRun(lastRun) : null,
        nextRunAt:
          enabled && channel !== 'manual' ? iso(Math.ceil(now() / 3_600_000) * 3_600_000) : null,
        running: lastRun?.status === 'queued' || lastRun?.status === 'running',
      };
    });
    return {
      channels,
      deadJobs: jobs.filter((job) => job.status === 'dead').length,
      queuedJobs: jobs.filter((job) => job.status === 'queued').length,
    };
  }

  const publicRun = ({ startAt: _s, finishAt: _f, ...run }: (typeof runs)[number]) =>
    structuredClone(run);

  function listRuns(cursor: string | undefined, limit: number) {
    tick();
    const sorted = [...runs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const offsetIndex = Number(cursor ?? 0);
    const next = offsetIndex + limit;
    return {
      items: sorted.slice(offsetIndex, next).map(publicRun),
      nextCursor: next < sorted.length ? String(next) : null,
    };
  }

  function runDetail(id: string) {
    tick();
    const run = runs.find((item) => item.id === id);
    if (!run) throw new MockError('NOT_FOUND', 404);
    return {
      ...publicRun(run),
      errors:
        run.status === 'failed' || run.failedCount > 0
          ? [{ cufe: null, code: 'EJEMPLO-RPA', message: run.errorMessage ?? 'Error de ejemplo.' }]
          : [],
    };
  }

  function requestSync(input: SyncRunRequest | { channel: 'manual' }) {
    tick();
    const channel = input.channel;
    if (channel === 'rpa' && !settings.rpaEnabled) throw new MockError('API_CHANNEL_DISABLED', 422);
    if (channel === 'imap' && !settings.imapEnabled)
      throw new MockError('API_CHANNEL_DISABLED', 422);
    if (channel !== 'manual' && !certificateValid())
      throw new MockError('API_CERTIFICATE_MISSING', 422);
    if (
      runs.some(
        (run) => run.channel === channel && (run.status === 'queued' || run.status === 'running'),
      )
    ) {
      throw new MockError('API_SYNC_RUNNING', 409);
    }
    const created = now();
    const run = {
      ...makeSyncRun(random, created, {
        channel,
        trigger: 'user',
        status: 'queued',
        requestedBy: MOCK_USER,
        periodStart: 'periodStart' in input ? (input.periodStart ?? null) : null,
        periodEnd: 'periodEnd' in input ? (input.periodEnd ?? null) : null,
        mailboxId: 'mailboxId' in input ? (input.mailboxId ?? null) : null,
        startedAt: null,
        finishedAt: null,
        listedCount: 0,
        newCount: 0,
        existingCount: 0,
        xmlDownloadedCount: 0,
        createdAt: iso(created),
      }),
      startAt: created + 1_000,
      finishAt: created + 4_000,
    };
    runs.push(run);
    return publicRun(run);
  }

  function jobAction(id: string, action: 'retry' | 'cancel') {
    const job = jobs.find((item) => item.id === id);
    if (!job) throw new MockError('NOT_FOUND', 404);
    if (action === 'retry') {
      if (job.status !== 'dead') throw new MockError('API_JOB_NOT_DEAD', 409);
      Object.assign(job, { status: 'queued', attempts: 0, runAt: iso(now()) });
    } else {
      if (job.status !== 'queued') throw new MockError('API_JOB_NOT_QUEUED', 409);
      job.status = 'cancelled';
    }
    return structuredClone(job);
  }

  function health(): DatadianHealth {
    tick();
    const active = certificates.find((item) => item.id === settings.activeCertificateId);
    const deadJobs = jobs.filter((job) => job.status === 'dead').length;
    const lastSync = [...runs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    const expiry = active?.expiryState ?? null;
    const status =
      !active || expiry === 'expired'
        ? 'error'
        : expiry === 'due_soon' || deadJobs > 0 || lastSync?.status === 'partial'
          ? 'warning'
          : 'ok';
    return {
      status,
      certificate: { expiryState: expiry, daysToExpiry: active?.daysToExpiry ?? null },
      deadJobs,
      lastSyncStatus: lastSync?.status ?? null,
      latencyMs: 640,
      checkedAt: iso(now()),
    };
  }

  // ---- Decisión interna heredada ----

  function decide(
    id: string,
    decision: 'draft' | 'approved' | 'rejected',
    extra: { rejectionCode?: string; reason?: string },
  ) {
    const record = find(id);
    const invoice = record.invoice;
    if (decision === 'approved' && !odoo) throw new MockError('BAD_REQUEST', 422);
    Object.assign(invoice, {
      status: decision,
      decidedBy: MOCK_USER.id,
      decidedAt: iso(now()),
      decisionReason: extra.reason ?? null,
      rejectionCode: decision === 'rejected' ? (extra.rejectionCode ?? null) : null,
      odoo:
        decision === 'approved'
          ? { status: 'sent', moveId: random.int(4000, 9000), error: null, sentAt: iso(now()) }
          : invoice.odoo,
    });
    const entries = history.get(id) ?? [];
    entries.push({
      id: random.uuid(),
      action: `received_document.${decision === 'approved' ? 'approve' : decision === 'rejected' ? 'reject' : 'draft'}`,
      actorUserId: MOCK_USER.id,
      result: 'success',
      metadata: {},
      createdAt: iso(now()),
    });
    history.set(id, entries);
    return view(record);
  }

  return {
    now,
    /** Mueve el reloj del mock (para pasar de `open` a `due_soon` y a `expired`). */
    advance: (ms: number) => {
      offset += ms;
      tick();
    },
    tick,
    invoices,
    list,
    summary,
    detail: (id: string) => view(find(id)),
    content: (id: string) => {
      const record = find(id);
      if (!record.content) throw new MockError('API_XML_MISSING', 409);
      return structuredClone(record.content);
    },
    xml: (id: string, part: 'attached' | 'invoice' | 'validation') => {
      const record = find(id);
      if (!record.invoice.hasAttachedDocument) throw new MockError('NOT_FOUND', 404);
      return makeXml(record, part);
    },
    events: (id: string) =>
      find(id).events.map(({ resolveAt: _r, attemptsLog: _a, ...event }) => structuredClone(event)),
    eventDetail: (id: string, eventId: string) => {
      const event = find(id).events.find((item) => item.id === eventId);
      if (!event) throw new MockError('NOT_FOUND', 404);
      const { resolveAt: _r, ...detail } = event;
      return structuredClone(detail);
    },
    eventXml: (id: string, eventId: string, part: 'request' | 'response') => {
      const event = find(id).events.find((item) => item.id === eventId);
      if (!event) throw new MockError('NOT_FOUND', 404);
      return `<?xml version="1.0" encoding="UTF-8"?><ApplicationResponse><!-- ${part} de ejemplo --><cbc:ResponseCode>${event.eventCode}</cbc:ResponseCode></ApplicationResponse>`;
    },
    requestEvent,
    rules: () => structuredClone(rules),
    setRules: (next: RadianRules['events']) => {
      rules.events = [...next];
    },
    settings: () => ({ odoo: structuredClone(odoo), dian: structuredClone(settings) }),
    patchSettings: (patch: Partial<DianSettings>) => {
      settings = { ...settings, ...patch };
    },
    saveSettings,
    readiness,
    certificates: () => {
      tick();
      return certificates.map(publicCertificate);
    },
    certificate: (id: string) => {
      tick();
      const certificate = certificates.find((item) => item.id === id);
      if (!certificate) throw new MockError('NOT_FOUND', 404);
      return publicCertificate(certificate);
    },
    uploadCertificate,
    activateCertificate,
    retireCertificate,
    mailboxes: () => structuredClone(mailboxes),
    saveMailbox,
    syncStatus,
    listRuns,
    runDetail,
    requestSync,
    jobs: (status: string | undefined) => {
      tick();
      const items = jobs.filter((job) => !status || job.status === status);
      return { items: structuredClone(items), nextCursor: null };
    },
    jobAction,
    health,
    decide,
    retryOdoo: (id: string) => view(find(id)),
    history: (id: string) => structuredClone(history.get(id) ?? []),
    saveOdoo: (input: { baseUrl: string; database: string }) => {
      odoo = { ...input, updatedAt: iso(now()) };
      return { odoo: structuredClone(odoo), dian: structuredClone(settings) };
    },
  };
}

export type MockDb = ReturnType<typeof createMockDb>;
