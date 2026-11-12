import type { OdooClient } from './odoo.client.js';

/** Lo que Odoo necesita de una factura recibida aprobada. */
export interface VendorBillSource {
  cufe: string;
  prefix: string | null;
  folio: string | null;
  issueDate: string | null;
  issuerNit: string | null;
  issuerName: string | null;
  iva: string | null;
  inc: string | null;
  total: string | null;
  costCenter: string | null;
  /** Id de la factura en Odoo si un intento anterior ya la creó. */
  odooMoveId: number | null;
}

export interface VendorBillResult {
  moveId: number;
  /** Adjunto del PDF en Odoo; null si la factura no tiene PDF guardado. */
  attachmentId: number | null;
  /** El proveedor no existe en Odoo con ese NIT: la factura queda sin proveedor para completarla allá. */
  partnerFound: boolean;
}

/**
 * Crea en Odoo la factura de proveedor en borrador y, si la factura tiene PDF, se lo adjunta, con la
 * misma lógica del escenario de Make: account.move y luego ir.attachment con res_model "account.move".
 * Es idempotente: si un intento anterior ya creó la factura o el adjunto, los reutiliza.
 */
export async function pushVendorBill(
  odoo: OdooClient,
  source: VendorBillSource,
  pdf: { fileName: string; content: Buffer } | null,
): Promise<VendorBillResult> {
  const partnerId = await findPartner(odoo, source.issuerNit);

  // El CUFE va en las notas de la factura: así un reintento la encuentra aunque no se haya guardado su id.
  const moveId =
    source.odooMoveId ??
    (
      await odoo.call<number[]>('account.move', 'search', {
        domain: [
          ['move_type', '=', 'in_invoice'],
          ['narration', 'ilike', source.cufe],
        ],
        limit: 1,
      })
    )[0] ??
    (await createVendorBill(odoo, source, partnerId));

  if (!pdf) return { moveId, attachmentId: null, partnerFound: partnerId !== null };

  const [existingAttachment] = await odoo.call<number[]>('ir.attachment', 'search', {
    domain: [
      ['res_model', '=', 'account.move'],
      ['res_id', '=', moveId],
      ['name', '=', pdf.fileName],
    ],
    limit: 1,
  });
  const attachmentId =
    existingAttachment ??
    (
      await odoo.call<number[]>('ir.attachment', 'create', {
        vals_list: [
          {
            name: pdf.fileName,
            type: 'binary',
            datas: pdf.content.toString('base64'),
            res_model: 'account.move',
            res_id: moveId,
            mimetype: 'application/pdf',
          },
        ],
      })
    )[0];
  if (attachmentId === undefined) throw new Error('Odoo did not return the attachment id');

  return { moveId, attachmentId, partnerFound: partnerId !== null };
}

async function findPartner(odoo: OdooClient, nit: string | null): Promise<number | null> {
  const base = nit?.replace(/[.\s]/g, '').split('-')[0];
  if (!base) return null;
  // En Odoo el NIT puede estar con o sin dígito de verificación.
  const [partnerId] = await odoo.call<number[]>('res.partner', 'search', {
    domain: ['|', ['vat', '=', base], ['vat', '=like', `${base}-_`]],
    limit: 1,
  });
  return partnerId ?? null;
}

async function createVendorBill(
  odoo: OdooClient,
  source: VendorBillSource,
  partnerId: number | null,
): Promise<number> {
  const [moveId] = await odoo.call<number[]>('account.move', 'create', {
    vals_list: [
      {
        move_type: 'in_invoice',
        ...(partnerId === null ? {} : { partner_id: partnerId }),
        ...(source.issueDate ? { invoice_date: source.issueDate } : {}),
        ref: invoiceNumber(source),
        narration: narration(source),
      },
    ],
  });
  if (moveId === undefined) throw new Error('Odoo did not return the vendor bill id');
  return moveId;
}

/** Número de la factura del proveedor: prefijo y folio, sin repetir el prefijo si el folio ya lo trae. */
export function invoiceNumber({ prefix, folio }: Pick<VendorBillSource, 'prefix' | 'folio'>) {
  const cleanPrefix = prefix?.trim() ?? '';
  const cleanFolio = folio?.trim() ?? '';
  return cleanFolio.startsWith(cleanPrefix) ? cleanFolio : `${cleanPrefix}${cleanFolio}`;
}

function narration(source: VendorBillSource): string {
  const lines = [
    `CUFE: ${source.cufe}`,
    `Proveedor según la DIAN: ${source.issuerName ?? ''} (NIT ${source.issuerNit ?? ''})`,
    `Total DIAN: ${source.total ?? ''} · IVA: ${source.iva ?? ''} · INC: ${source.inc ?? ''}`,
    `Centro de costos: ${source.costCenter ?? ''}`,
    'Cargada desde DataDian (OrveX.IA).',
  ];
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('');
}

function escapeHtml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  );
}
