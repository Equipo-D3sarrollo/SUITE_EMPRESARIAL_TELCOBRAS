import {
  computeNitCheckDigit,
  type DianCertificate,
  type ImapMailbox,
  type InvoiceContent,
  invoiceContentSchema,
  type RadianEventCode,
  type RadianEventDetail,
  type RadianInvoiceDetail,
  type RadianStatus,
  radianEventDetailSchema,
  radianInvoiceDetailSchema,
  type SyncRun,
  syncRunSchema,
  type TelcoJob,
  telcoJobSchema,
} from '@telcobras/contracts';

/**
 * Fixtures y fábricas de los mocks de DataDian (§4.3). Todo pasa por `schema.parse`: un fixture que
 * no cumple el contrato falla al cargarse. Datos anonimizados: NIT y nombres ficticios.
 */

/** PRNG determinista (mulberry32): mismas facturas en cada carga con la misma semilla. */
export function createRandom(seed: number) {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const hex = (length: number) =>
    Array.from({ length }, () => Math.floor(next() * 16).toString(16)).join('');
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    hex,
    uuid: () => `${hex(8)}-${hex(4)}-4${hex(3)}-8${hex(3)}-${hex(12)}`,
    pick: <T>(items: readonly T[]) => items[Math.floor(next() * items.length)] as T,
  };
}
export type Random = ReturnType<typeof createRandom>;

export type Scenario = 'dian-rejects' | 'telco-fails' | 'tacit-acceptance';

export const MOCK_USER = {
  id: '0192f7a0-0000-7000-8000-00000000c0de',
  name: 'Contadora de prueba',
};
/** NIT de la organización simulada (sin DV). */
export const MOCK_ORG_NIT = '901234567';

const SUPPLIERS = [
  'Suministros Andinos S.A.S.',
  'Redes del Caribe Ltda.',
  'Papelería La Sabana S.A.S.',
  'Transportes Cordillera S.A.',
  'Energía Llanera S.A. E.S.P.',
  'Ferretería El Tornillo S.A.S.',
  'Servicios Cloud Colombia S.A.S.',
  'Aseo Integral del Valle S.A.S.',
  'Cables y Fibra Ópticas S.A.S.',
  'Proveedor <script>alert(1)</script> S.A.S.',
];

const iso = (ms: number) => new Date(ms).toISOString();
const DAY = 86_400_000;
const money = (value: number) => value.toFixed(2);

export function nitWithDv(base: string) {
  return `${base}-${computeNitCheckDigit(base)}`;
}

/** Día hábil siguiente (sin sábados ni domingos; el mock no conoce festivos). */
export function addBusinessDays(fromMs: number, days: number): number {
  const date = new Date(fromMs);
  let added = 0;
  while (added < days) {
    date.setUTCDate(date.getUTCDate() + 1);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) added++;
  }
  // 23:59:59 en Bogotá (UTC-5) de ese día.
  const day = date.toISOString().slice(0, 10);
  return new Date(`${day}T23:59:59-05:00`).getTime();
}

export function businessDaysBetween(fromMs: number, toMs: number): number {
  let count = 0;
  const date = new Date(fromMs);
  while (date.getTime() < toMs) {
    date.setUTCDate(date.getUTCDate() + 1);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6 && date.getTime() <= toMs + DAY) count++;
  }
  return Math.max(0, count - 1);
}

export type EventRecord = RadianEventDetail & {
  /** Momento simulado en que la DIAN responde. */
  resolveAt?: number;
};

export type InvoiceRecord = {
  invoice: RadianInvoiceDetail;
  scenario?: Scenario;
  events: EventRecord[];
  content: InvoiceContent | null;
};

export function makeEvent(
  random: Random,
  invoiceId: string,
  code: RadianEventCode,
  atMs: number,
  overrides: Partial<RadianEventDetail> = {},
): EventRecord {
  const fromDian = code === '034';
  return radianEventDetailSchema.parse({
    id: random.uuid(),
    receivedDocumentId: invoiceId,
    eventCode: code,
    actor: fromDian ? 'issuer' : 'buyer',
    origin: fromDian ? 'dian' : 'suite',
    environment: '2',
    status: 'accepted',
    claimCode: null,
    claimNote: null,
    cude: random.hex(96),
    generatedAt: fromDian ? null : iso(atMs - 60_000),
    sentAt: fromDian ? null : iso(atMs - 30_000),
    dianRegisteredAt: iso(atMs),
    dianStatusCode: '02',
    errorMessage: null,
    errorTrace: [],
    attempts: fromDian ? 0 : 1,
    requestedBy: fromDian ? null : MOCK_USER,
    hasRequestXml: !fromDian,
    hasResponseXml: !fromDian,
    createdAt: iso(atMs - 90_000),
    attemptsLog: fromDian
      ? []
      : [
          {
            attemptNo: 1,
            startedAt: iso(atMs - 30_000),
            finishedAt: iso(atMs),
            outcome: 'accepted',
            httpStatus: 200,
            dianStatusCode: '02',
            durationMs: 820,
            errorTrace: [],
          },
        ],
    ...overrides,
  });
}

/** Traza rotulada como ficticia: no son reglas reales de la DIAN (§4.2). */
export const FICTITIOUS_TRACE = [
  { code: 'EJEMPLO-01', message: 'Ejemplo ficticio de los mocks: regla de validación incumplida.' },
  {
    code: 'EJEMPLO-02',
    message: 'Ejemplo ficticio de los mocks: el evento previo no está en RADIAN.',
  },
];

function makeContent(invoice: RadianInvoiceDetail): InvoiceContent {
  const total = Number(invoice.total ?? 0);
  const subtotal = Math.round((total / 1.19) * 100) / 100;
  const tax = Math.round((total - subtotal) * 100) / 100;
  const first = Math.round(subtotal * 0.6 * 100) / 100;
  const second = Math.round((subtotal - first) * 100) / 100;
  return invoiceContentSchema.parse({
    number: `${invoice.prefix ?? ''}${invoice.folio ?? ''}`,
    issueDate: invoice.issueDate,
    issueTime: '10:15:00-05:00',
    dueDate: invoice.dueDate,
    currency: 'COP',
    supplier: {
      nit: invoice.issuerNit?.split('-')[0] ?? null,
      nitDv: invoice.issuerNit?.split('-')[1] ?? null,
      name: invoice.issuerName,
      address: 'Calle 100 # 10-20',
      city: 'Bogotá D.C.',
      email: 'facturacion@proveedor.example',
    },
    buyer: {
      nit: MOCK_ORG_NIT,
      nitDv: String(computeNitCheckDigit(MOCK_ORG_NIT)),
      name: 'Organización de prueba S.A.S.',
      address: 'Carrera 7 # 71-21',
      city: 'Bogotá D.C.',
      email: null,
    },
    paymentForm: invoice.paymentForm,
    paymentMeansCode: invoice.paymentMeansCode,
    lines: [
      {
        lineNo: 1,
        description: 'Servicio de conectividad dedicada',
        quantity: '1',
        unitCode: 'EA',
        unitPrice: money(first),
        lineTotal: money(first),
        taxPercent: '19.00',
      },
      {
        lineNo: 2,
        description: 'Instalación y configuración',
        quantity: '2',
        unitCode: 'EA',
        unitPrice: money(second / 2),
        lineTotal: money(second),
        taxPercent: '19.00',
      },
    ],
    taxes: invoice.taxes,
    totals: {
      lineExtension: money(subtotal),
      taxExclusive: money(subtotal),
      taxInclusive: money(total),
      allowances: '0.00',
      charges: '0.00',
      payable: money(total),
    },
    dianValidation: invoice.dianValidatedAt
      ? {
          validatedAt: invoice.dianValidatedAt,
          statusCode: '02',
          statusDescription: 'Documento validado por la DIAN',
        }
      : null,
    notes: tax > 0 ? ['Factura de ejemplo generada por los mocks de DataDian.'] : [],
    xmlSha256: null,
  });
}

/** Escapa texto para XML: el nombre del proveedor de prueba trae `<script>`. */
const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`);

export function makeXml(record: InvoiceRecord, part: 'attached' | 'invoice' | 'validation') {
  const invoice = record.invoice;
  const name = escapeXml(invoice.issuerName ?? '');
  const inner = `<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"><cbc:ID>${escapeXml(`${invoice.prefix ?? ''}${invoice.folio ?? ''}`)}</cbc:ID><cbc:UUID schemeName="CUFE-SHA384">${invoice.cufe}</cbc:UUID><cbc:IssueDate>${invoice.issueDate}</cbc:IssueDate><cbc:ProfileExecutionID>${invoice.profileExecutionId ?? '2'}</cbc:ProfileExecutionID><cac:AccountingSupplierParty><cac:Party><cac:PartyName><cbc:Name>${name}</cbc:Name></cac:PartyName></cac:Party></cac:AccountingSupplierParty><cac:LegalMonetaryTotal><cbc:PayableAmount currencyID="COP">${invoice.total}</cbc:PayableAmount></cac:LegalMonetaryTotal></Invoice>`;
  if (part === 'invoice') return `<?xml version="1.0" encoding="UTF-8"?>${inner}`;
  const validation = `<ApplicationResponse><cbc:ResponseCode>02</cbc:ResponseCode><cbc:Description>Documento validado por la DIAN (ejemplo)</cbc:Description></ApplicationResponse>`;
  if (part === 'validation') return `<?xml version="1.0" encoding="UTF-8"?>${validation}`;
  return `<?xml version="1.0" encoding="UTF-8"?><AttachedDocument><cbc:ParentDocumentID>${invoice.cufe}</cbc:ParentDocumentID><cac:Attachment><cbc:Description><![CDATA[${inner}]]></cbc:Description></cac:Attachment><cac:ParentDocumentLineReference><cbc:Description><![CDATA[${validation}]]></cbc:Description></cac:ParentDocumentLineReference></AttachedDocument>`;
}

type Spec = {
  radian: RadianStatus;
  validation?: RadianInvoiceDetail['validationStatus'];
  /** Momento del 032 (para el plazo) en ms relativos a "ahora". */
  goodsAgoMs?: number;
  deadlineInMs?: number;
  payment?: '1' | '2';
  source?: RadianInvoiceDetail['ingestionSource'];
  scenario?: Scenario;
  environment?: '1' | '2';
  legacy?: boolean;
  snapshot?: boolean;
  rejectedPrevious?: boolean;
};

/** Unas 40 facturas que cubren estados RADIAN, de validación y de plazo, canales y la heredada. */
const SPECS: Spec[] = [
  { radian: 'none' },
  { radian: 'none', payment: '1' },
  { radian: 'none', source: 'imap' },
  { radian: 'none', scenario: 'telco-fails' },
  { radian: 'none', snapshot: true },
  { radian: 'none', validation: 'pending_validation' },
  { radian: 'none', validation: 'pending_xml', source: 'rpa' },
  { radian: 'none', validation: 'invalid' },
  { radian: 'none', environment: '1' },
  { radian: 'none', legacy: true, validation: 'pending_xml', source: 'manual' },
  { radian: 'acknowledged' },
  { radian: 'acknowledged', scenario: 'dian-rejects' },
  { radian: 'acknowledged', source: 'imap' },
  { radian: 'acknowledged', rejectedPrevious: true },
  { radian: 'acknowledged', payment: '1' },
  { radian: 'goods_received', deadlineInMs: 2 * DAY },
  { radian: 'goods_received', deadlineInMs: 3 * DAY },
  { radian: 'goods_received', deadlineInMs: 10 * 3_600_000 },
  { radian: 'goods_received', deadlineInMs: 5 * 3_600_000 },
  { radian: 'goods_received', deadlineInMs: -DAY },
  { radian: 'goods_received', deadlineInMs: 2 * 60_000, scenario: 'tacit-acceptance' },
  { radian: 'goods_received', deadlineInMs: 2 * DAY, source: 'imap' },
  { radian: 'claimed' },
  { radian: 'claimed' },
  { radian: 'accepted_express' },
  { radian: 'accepted_express', source: 'imap' },
  { radian: 'accepted_tacit' },
  ...Array.from(
    { length: 13 },
    (_, index): Spec => ({
      radian: (['none', 'acknowledged', 'accepted_express'] as const)[index % 3] ?? 'none',
      source: index % 4 === 0 ? 'imap' : 'rpa',
    }),
  ),
];

const PATH: Record<RadianStatus, RadianEventCode[]> = {
  none: [],
  acknowledged: ['030'],
  goods_received: ['030', '032'],
  claimed: ['030', '032', '031'],
  accepted_express: ['030', '032', '033'],
  accepted_tacit: ['030', '032', '034'],
};

export function makeInvoices(random: Random, nowMs: number): InvoiceRecord[] {
  return SPECS.map((spec, index) => {
    const id = random.uuid();
    const issueMs = nowMs - (index % 12) * DAY - (index > 30 ? 20 * DAY : 0);
    const issueDate = new Date(issueMs - 5 * 3_600_000).toISOString().slice(0, 10);
    const total = random.int(80_000, 18_000_000);
    const subtotal = Math.round((total / 1.19) * 100) / 100;
    const tax = Math.round((total - subtotal) * 100) / 100;
    const supplier = SUPPLIERS[index % SUPPLIERS.length] ?? 'Proveedor S.A.S.';
    const nitBase = `9${String(100_000_00 + index * 7_919).padStart(8, '0')}`;
    const validation = spec.validation ?? 'valid';
    const hasXml = validation !== 'pending_xml';
    const codes = PATH[spec.radian];
    const deadlineAt =
      spec.deadlineInMs !== undefined ? nowMs + spec.deadlineInMs : nowMs - 4 * DAY;
    const goodsAt = deadlineAt - 3 * DAY;

    const events: EventRecord[] = [];
    codes.forEach((code, position) => {
      const at =
        code === '032'
          ? goodsAt
          : code === '030'
            ? goodsAt - DAY
            : code === '034'
              ? deadlineAt + 60_000
              : goodsAt + DAY / 2 + position;
      events.push(
        makeEvent(
          random,
          id,
          code,
          at,
          code === '031' ? { claimCode: '02', claimNote: 'Faltaron 3 unidades del pedido.' } : {},
        ),
      );
    });
    if (spec.rejectedPrevious) {
      events.push(
        makeEvent(random, id, '032', nowMs - 3_600_000, {
          status: 'rejected',
          cude: null,
          dianRegisteredAt: null,
          dianStatusCode: '04',
          errorMessage: 'La DIAN rechazó el evento (ejemplo ficticio).',
          errorTrace: FICTITIOUS_TRACE,
        }),
      );
    }

    const invoice = radianInvoiceDetailSchema.parse({
      id,
      importId: spec.legacy ? random.uuid() : null,
      documentType: 'Factura electrónica',
      cufe: random.hex(96),
      folio: String(1_172_766_000 + index),
      prefix: index % 3 === 0 ? 'FE' : 'R',
      paymentMethod: spec.payment ?? '2',
      issueDate,
      receivedAt: iso(issueMs + 3_600_000),
      issuerNit: nitWithDv(nitBase),
      issuerName: supplier,
      iva: money(tax),
      inc: '0.00',
      total: money(total),
      dianStatus: 'Aprobado',
      dianGroup: 'Recibido',
      costCenter: null,
      paymentType: spec.payment === '1' ? 'CONTADO' : 'CREDITO',
      acknowledgmentStatus: null,
      invoiceReference: null,
      observations: null,
      status: index % 7 === 3 ? 'approved' : 'imported',
      decidedBy: null,
      decidedAt: null,
      decisionReason: null,
      rejectionCode: null,
      pdf: spec.legacy
        ? { fileName: 'factura.pdf', uploadedAt: iso(issueMs), sizeBytes: 48_000 }
        : null,
      odoo:
        index % 7 === 3
          ? { status: 'sent', moveId: 4100 + index, error: null, sentAt: iso(issueMs + DAY) }
          : null,
      createdAt: iso(issueMs + 3_600_000),
      syncRunId: null,
      ingestionSource: spec.source ?? 'rpa',
      issuedAt: iso(issueMs),
      dueDate: new Date(issueMs + 30 * DAY).toISOString().slice(0, 10),
      dianValidatedAt: hasXml ? iso(issueMs + 600_000) : null,
      buyerNit: MOCK_ORG_NIT,
      currency: 'COP',
      subtotal: money(subtotal),
      taxTotal: money(tax),
      paymentForm: spec.payment ?? '2',
      paymentMeansCode: spec.payment === '1' ? '10' : '42',
      ublTypeCode: '01',
      profileExecutionId: spec.environment ?? '2',
      validationStatus: validation,
      validationErrors:
        validation === 'invalid'
          ? [{ code: 'buyer_mismatch', message: 'El adquirente del XML no es esta organización.' }]
          : [],
      radianStatus: spec.radian,
      radianStatusAt: codes.length ? events[codes.length - 1]?.dianRegisteredAt : null,
      deadline: {
        claimDeadlineAt: codes.includes('032') ? iso(deadlineAt) : null,
        state: 'none',
        businessDaysRemaining: null,
        ruleVersion: codes.includes('032') ? 1 : null,
        ruleVerified: false,
      },
      eventsExpected: (spec.payment ?? '2') === '2',
      notesBlocked: codes.includes('033') || codes.includes('034'),
      acceptedEventCodes: codes,
      pendingEvent: null,
      hasAttachedDocument: hasXml,
      taxes: [
        {
          taxSchemeId: '01',
          percent: '19.00',
          taxableAmount: money(subtotal),
          taxAmount: money(tax),
          isWithholding: false,
        },
        ...(index % 4 === 0
          ? [
              {
                taxSchemeId: '06',
                percent: '2.50',
                taxableAmount: money(subtotal),
                taxAmount: money(subtotal * 0.025),
                isWithholding: true,
              },
            ]
          : []),
      ],
      listingSnapshot: spec.snapshot
        ? { issuerName: 'SUMINISTROS ANDINOS', total: '1000.00' }
        : null,
    });

    return {
      invoice,
      scenario: spec.scenario,
      events,
      content: hasXml ? makeContent(invoice) : null,
    } satisfies InvoiceRecord;
  });
}

export function makeCertificate(
  random: Random,
  nowMs: number,
  overrides: Partial<DianCertificate> = {},
): DianCertificate {
  return {
    id: random.uuid(),
    status: 'valid',
    isActive: false,
    pfxSha256: random.hex(64),
    pfxSizeBytes: 4_812,
    serialNumber: random.hex(16),
    subjectNit: MOCK_ORG_NIT,
    subjectDn: `CN=ORGANIZACION DE PRUEBA SAS, SERIALNUMBER=${MOCK_ORG_NIT}, C=CO`,
    issuerDn: 'CN=Entidad de Certificación de Ejemplo, O=Ejemplo, C=CO',
    notBefore: iso(nowMs - 245 * DAY),
    notAfter: iso(nowMs + 120 * DAY),
    signatureAlgorithm: 'sha256WithRSAEncryption',
    checks: [
      'format',
      'validity',
      'key_usage_critical',
      'key_usage_purposes',
      'signature_algorithm',
      'chain',
      'nit_match',
    ].map((check) => ({ check, status: 'ok' })) as DianCertificate['checks'],
    daysToExpiry: 120,
    expiryState: 'ok',
    uploadedBy: MOCK_USER,
    createdAt: iso(nowMs - 245 * DAY),
    validatedAt: iso(nowMs - 245 * DAY),
    retiredAt: null,
    ...overrides,
  };
}

export function makeMailbox(random: Random, nowMs: number): ImapMailbox {
  return {
    id: random.uuid(),
    host: 'imap.correo.example',
    port: 993,
    useTls: true,
    username: 'facturas@organizacion.example',
    authMethod: 'password',
    folder: 'INBOX',
    enabled: true,
    secretSet: true,
    lastSyncAt: iso(nowMs - 3_600_000),
    updatedAt: iso(nowMs - 10 * DAY),
  };
}

export function makeSyncRun(
  random: Random,
  atMs: number,
  overrides: Partial<SyncRun> = {},
): SyncRun {
  return syncRunSchema.parse({
    id: random.uuid(),
    channel: 'rpa',
    trigger: 'schedule',
    status: 'succeeded',
    requestedBy: null,
    mailboxId: null,
    periodStart: null,
    periodEnd: null,
    startedAt: iso(atMs),
    finishedAt: iso(atMs + 42_000),
    listedCount: 14,
    newCount: 3,
    existingCount: 11,
    xmlDownloadedCount: 3,
    failedCount: 0,
    emptyListingWarning: false,
    humanVerificationRequired: false,
    errorMessage: null,
    createdAt: iso(atMs - 1_000),
    ...overrides,
  });
}

export function makeJob(random: Random, atMs: number, overrides: Partial<TelcoJob>): TelcoJob {
  return telcoJobSchema.parse({
    id: random.uuid(),
    kind: 'xml_fetch',
    status: 'dead',
    attempts: 5,
    maxAttempts: 5,
    runAt: iso(atMs),
    lastError: 'Tiempo de espera agotado al consultar GetXmlByDocumentKey (ejemplo).',
    lastErrorAt: iso(atMs),
    resource: null,
    createdAt: iso(atMs - DAY),
    ...overrides,
  });
}
