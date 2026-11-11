import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { DocumentsSettings, OdooConnectionInput } from '@telcobras/contracts';
import { assertPermission } from '../../auth/permissions.js';
import { CredentialsCipher } from '../../common/credentials-cipher.js';
import type { RequestActor } from '../../common/request-actor.js';
import { ENV } from '../../config/config.module.js';
import type { Env } from '../../config/env.js';
import type { Database } from '../../database/database.js';
import { DB } from '../../database/db.module.js';
import { auditLogs, odooConnections } from '../../database/schema/index.js';
import { type TenantScope, type Transaction, withTenant } from '../../database/tenant.js';
import { OdooClient, type OdooConfig, OdooError } from './odoo.client.js';

/** Configuración de DataDian por organización: hoy, la conexión con Odoo. */
@Injectable()
export class DocumentsSettingsService {
  constructor(
    @Inject(DB) private readonly db: Database,
    @Inject(CredentialsCipher) private readonly cipher: CredentialsCipher,
    @Inject(ENV) private readonly env: Pick<Env, 'NODE_ENV'>,
  ) {}

  async get(actor: RequestActor): Promise<DocumentsSettings> {
    return withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      const [connection] = await tx
        .select({
          baseUrl: odooConnections.baseUrl,
          database: odooConnections.database,
          updatedAt: odooConnections.updatedAt,
        })
        .from(odooConnections)
        .limit(1);
      return {
        odoo: connection ? { ...connection, updatedAt: connection.updatedAt.toISOString() } : null,
      };
    });
  }

  /** Guarda la conexión solo si Odoo acepta las credenciales. */
  async saveOdoo(actor: RequestActor, input: OdooConnectionInput): Promise<DocumentsSettings> {
    const scope = tenantScope(actor);
    if (this.env.NODE_ENV === 'production' && !input.baseUrl.startsWith('https://')) {
      throw new UnprocessableEntityException('La dirección de Odoo debe usar https');
    }
    await withTenant(this.db, scope, (tx) =>
      assertPermission(tx, actor.userId, 'documents:configure'),
    );
    await verify(input);

    await withTenant(this.db, scope, async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:configure');
      const values = {
        baseUrl: input.baseUrl,
        database: input.database,
        apiKey: this.cipher.encrypt(input.apiKey),
        updatedBy: actor.userId,
      };
      await tx
        .insert(odooConnections)
        .values({ organizationId: scope.orgId, ...values })
        .onConflictDoUpdate({ target: odooConnections.organizationId, set: values });
      await tx.insert(auditLogs).values({
        organizationId: scope.orgId,
        actorUserId: actor.userId,
        action: 'odoo_connection.save',
        resourceType: 'odoo_connection',
        resourceId: scope.orgId,
        result: 'success',
        // Nunca la API key: solo a dónde apunta la conexión.
        metadata: { baseUrl: input.baseUrl, database: input.database },
      });
    });
    return this.get(actor);
  }

  /** Prueba la conexión guardada. */
  async testOdoo(actor: RequestActor): Promise<{ ok: true }> {
    const config = await withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:configure');
      return this.odooConfig(tx);
    });
    if (!config) throw new NotFoundException('Odoo connection is not configured');
    await verify(config);
    return { ok: true };
  }

  /** Conexión de la organización de la transacción, con la API key descifrada. Solo para uso interno. */
  async odooConfig(tx: Transaction): Promise<OdooConfig | null> {
    const [connection] = await tx.select().from(odooConnections).limit(1);
    if (!connection) return null;
    return {
      baseUrl: connection.baseUrl,
      database: connection.database,
      apiKey: this.cipher.decrypt(connection.apiKey),
    };
  }

  async hasOdooConnection(tx: Transaction): Promise<boolean> {
    const [connection] = await tx
      .select({ id: odooConnections.organizationId })
      .from(odooConnections)
      .limit(1);
    return connection !== undefined;
  }
}

async function verify(config: OdooConfig): Promise<void> {
  try {
    // context_get es un método de modelo de res.users: responde si la API key y la base son válidas.
    await new OdooClient(config).call('res.users', 'context_get');
  } catch (error) {
    if (error instanceof OdooError) throw new UnprocessableEntityException(error.message);
    throw error;
  }
}

function tenantScope(actor: RequestActor): TenantScope {
  if (!actor.orgId) throw new ForbiddenException('Select an organization first');
  return { orgId: actor.orgId, userId: actor.userId };
}
