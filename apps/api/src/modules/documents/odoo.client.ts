/**
 * Cliente mínimo de la API JSON-2 de Odoo 19: POST /json/2/<modelo>/<método>, argumentos con nombre
 * y la API key como bearer. Documentación: odoo.com/documentation/19.0/developer/reference/external_api.html
 */

const TIMEOUT_MS = 30_000;
const MAX_ERROR_LENGTH = 500;

export interface OdooConfig {
  baseUrl: string;
  database: string;
  apiKey: string;
}

export class OdooError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
  ) {
    super(message);
    this.name = 'OdooError';
  }
}

export class OdooClient {
  constructor(private readonly config: OdooConfig) {}

  async call<T>(model: string, method: string, body: Record<string, unknown> = {}): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.config.baseUrl}/json/2/${model}/${method}`, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json; charset=utf-8',
          'X-Odoo-Database': this.config.database,
          'User-Agent': 'OrveX.IA-DataDian',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: 'error',
      });
    } catch (error) {
      const reason =
        error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'network';
      throw new OdooError(
        reason === 'timeout' ? 'Odoo no respondió a tiempo' : 'No fue posible conectar con Odoo',
        null,
      );
    }

    const text = await response.text();
    if (!response.ok) {
      throw new OdooError(
        `Odoo respondió ${response.status}: ${errorMessage(text)}`,
        response.status,
      );
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new OdooError('Odoo devolvió una respuesta que no es JSON', response.status);
    }
  }
}

/** Mensaje de error de Odoo ({ name, message, arguments, debug }) sin el traceback. */
function errorMessage(body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: unknown };
    if (typeof parsed.message === 'string') return parsed.message.slice(0, MAX_ERROR_LENGTH);
  } catch {
    // Cuerpo no JSON (por ejemplo, una página HTML de error del proxy).
  }
  return body.replace(/\s+/g, ' ').trim().slice(0, MAX_ERROR_LENGTH) || 'sin detalle';
}
