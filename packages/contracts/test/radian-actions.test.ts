import { describe, expect, it } from 'vitest';
import {
  buildDatadianOpenApi,
  DATADIAN_ROUTES,
  deriveRadianActions,
  type RadianActionsInput,
  type RadianEventCode,
  radianEventRequestSchema,
  radianSequenceViolation,
  SEED_RADIAN_EVENT_RULES,
} from '../src/index.js';

const base: RadianActionsInput = {
  validationStatus: 'valid',
  invoiceEnvironment: '2',
  configuredEnvironment: '2',
  paymentForm: '2',
  acceptedCodes: [],
  pendingEvent: null,
  deadlineState: 'none',
  rules: SEED_RADIAN_EVENT_RULES,
  readiness: { certificateValid: true, softwareConfigured: true },
  canRequestEvents: true,
};

const visible = (input: Partial<RadianActionsInput>) =>
  deriveRadianActions({ ...base, ...input })
    .buttons.filter((button) => button.visible)
    .map((button) => button.code);

describe('deriveRadianActions: camino del blueprint', () => {
  it.each<[RadianEventCode[], string, string[]]>([
    [[], 'new', ['030']],
    [['030'], 'acknowledged', ['032']],
    [['030', '032'], 'goods_received', ['033', '031']],
  ])('aceptados %j → estado %s con botones %j', (accepted, state, buttons) => {
    const actions = deriveRadianActions({ ...base, acceptedCodes: accepted });
    expect(actions.state).toBe(state);
    expect(actions.buttons.map((button) => button.code)).toEqual(buttons);
    expect(actions.buttons.every((button) => button.enabled)).toBe(true);
  });

  it('cada botón lleva su variante de color', () => {
    const tones = deriveRadianActions({ ...base, acceptedCodes: ['030', '032'] }).buttons.map(
      (button) => [button.code, button.tone],
    );
    expect(tones).toEqual([
      ['033', 'primary'],
      ['031', 'destructive'],
    ]);
    expect(deriveRadianActions(base).buttons[0]?.tone).toBe('info');
    expect(deriveRadianActions({ ...base, acceptedCodes: ['030'] }).buttons[0]?.tone).toBe(
      'accent',
    );
  });

  it.each<RadianEventCode>(['031', '033', '034'])(
    'el %s aceptado deja la factura terminal',
    (code) => {
      const actions = deriveRadianActions({ ...base, acceptedCodes: ['030', '032', code] });
      expect(actions).toMatchObject({ state: 'terminal', terminalCause: code, buttons: [] });
    },
  );

  it('el 034 del emisor (origen DIAN) cuenta igual que uno de la suite', () => {
    expect(visible({ acceptedCodes: ['030', '032', '034'] })).toEqual([]);
  });

  it('plazo vencido sin decisión: terminal por defecto, o 031 con advertencia si se decide así', () => {
    const accepted: RadianEventCode[] = ['030', '032'];
    expect(
      deriveRadianActions({ ...base, acceptedCodes: accepted, deadlineState: 'expired' }),
    ).toMatchObject({ state: 'terminal', terminalCause: 'deadline_expired' });
    const open = deriveRadianActions({
      ...base,
      acceptedCodes: accepted,
      deadlineState: 'expired',
      options: { expiryIsTerminal: false, cashInvoices: 'warn' },
    });
    expect(open.state).toBe('goods_received');
    expect(open.warnings).toContain('deadline_expired');
  });

  it('XML no válido u otro ambiente: bloqueada sin botones', () => {
    expect(deriveRadianActions({ ...base, validationStatus: 'pending_xml' })).toMatchObject({
      state: 'blocked',
      blockedReason: 'xml_not_valid',
      buttons: [],
    });
    expect(deriveRadianActions({ ...base, invoiceEnvironment: '1' })).toMatchObject({
      state: 'blocked',
      blockedReason: 'environment_mismatch',
    });
  });

  it('desactiva con motivo: evento en curso, certificado, software, contado bloqueado', () => {
    const reason = (input: Partial<RadianActionsInput>) =>
      deriveRadianActions({ ...base, ...input }).buttons[0]?.reason;
    expect(reason({ pendingEvent: { eventCode: '030' } })).toBe('event_in_progress');
    expect(reason({ readiness: { certificateValid: false, softwareConfigured: true } })).toBe(
      'certificate_missing',
    );
    expect(reason({ readiness: { certificateValid: true, softwareConfigured: false } })).toBe(
      'software_missing',
    );
    expect(
      reason({ paymentForm: '1', options: { expiryIsTerminal: true, cashInvoices: 'block' } }),
    ).toBe('cash_invoice');
    expect(deriveRadianActions({ ...base, paymentForm: '1' }).warnings).toContain('cash_invoice');
  });

  it('sin permiso los botones no se muestran', () => {
    expect(visible({ canRequestEvents: false })).toEqual([]);
  });

  it('cambiar la regla del 031 a {030} lo habilita en el Estado 2 sin tocar código', () => {
    const rules = SEED_RADIAN_EVENT_RULES.map((rule) =>
      rule.eventCode === '031' ? { ...rule, requires: ['030' as const] } : rule,
    );
    expect(visible({ acceptedCodes: ['030'], rules })).toEqual(['032', '031']);
  });

  it('matriz: ningún estado muestra un botón ya aceptado ni uno fuera de secuencia', () => {
    const codes: RadianEventCode[] = ['030', '031', '032', '033', '034'];
    let combinations = 0;
    for (let mask = 0; mask < 1 << codes.length; mask++) {
      const accepted = codes.filter((_, index) => mask & (1 << index));
      for (const deadlineState of ['none', 'open', 'due_soon', 'expired'] as const) {
        for (const canRequestEvents of [true, false]) {
          for (const pending of [null, { eventCode: '030' as const }]) {
            combinations++;
            const actions = deriveRadianActions({
              ...base,
              acceptedCodes: accepted,
              deadlineState,
              canRequestEvents,
              pendingEvent: pending,
            });
            for (const button of actions.buttons) {
              expect(accepted).not.toContain(button.code);
              expect(radianSequenceViolation(button.code, accepted, SEED_RADIAN_EVENT_RULES)).toBe(
                null,
              );
              if (pending) expect(button.enabled).toBe(false);
            }
          }
        }
      }
    }
    expect(combinations).toBeGreaterThanOrEqual(200);
  });
});

describe('contratos de DataDian', () => {
  it('el reclamo exige concepto y el 033 no lo admite', () => {
    expect(radianEventRequestSchema.safeParse({ eventCode: '031' }).success).toBe(false);
    expect(radianEventRequestSchema.safeParse({ eventCode: '033', claimCode: '01' }).success).toBe(
      false,
    );
    expect(radianEventRequestSchema.safeParse({ eventCode: '031', claimCode: '02' }).success).toBe(
      true,
    );
  });

  it('el OpenAPI generado tiene las 32 rutas y ninguna respuesta expone secretos', () => {
    const document = buildDatadianOpenApi();
    const operations = Object.values(document.paths).flatMap((methods) => Object.values(methods));
    expect(operations.filter((op) => String(op.operationId).startsWith('datadianE'))).toHaveLength(
      32,
    );
    // Recorre las llaves de `properties` de todos los esquemas de respuesta.
    const keys = (node: unknown): string[] => {
      if (typeof node !== 'object' || node === null) return [];
      return Object.entries(node).flatMap(([key, value]) => [
        ...(key === 'properties' && typeof value === 'object' && value ? Object.keys(value) : []),
        ...keys(value),
      ]);
    };
    for (const operation of operations) {
      const names = keys(operation.responses);
      for (const secret of ['password', 'softwarePin', 'pfxDataKey', 'secret']) {
        expect(names, String(operation.operationId)).not.toContain(secret);
      }
    }
    expect(Object.keys(DATADIAN_ROUTES).filter((id) => id.startsWith('E'))).toHaveLength(32);
  });
});
