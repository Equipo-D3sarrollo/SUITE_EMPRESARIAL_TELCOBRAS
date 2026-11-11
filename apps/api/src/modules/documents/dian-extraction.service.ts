import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type {
  CursorPage,
  CursorPageQuery,
  DianExtractionJob,
  DianExtractionRequest,
  DianExtractionStage,
  DianSession,
  DianTokenLink,
} from '@telcobras/contracts';
import { eq, inArray } from 'drizzle-orm';
import { assertPermission } from '../../auth/permissions.js';
import { CredentialsCipher } from '../../common/credentials-cipher.js';
import { afterCursor, newestFirst, toCursorPage } from '../../common/pagination.js';
import type { RequestActor } from '../../common/request-actor.js';
import type { Database } from '../../database/database.js';
import { DB } from '../../database/db.module.js';
import {
  auditLogs,
  dianExtractionJobs,
  dianSessions,
  organizations,
} from '../../database/schema/index.js';
import { type TenantScope, type Transaction, withTenant } from '../../database/tenant.js';
import {
  type DianCookie,
  DianCookieJar,
  DianPortalClient,
  type DianPortalClientOptions,
  DianPortalError,
} from './dian-portal.client.js';
import { ReceivedDocumentsService } from './received-documents.service.js';

/** Opciones del cliente del portal (ritmo de sondeo, fetch). Las pruebas inyectan las suyas. */
export const DIAN_PORTAL_OPTIONS = Symbol('DIAN_PORTAL_OPTIONS');

type JobRow = typeof dianExtractionJobs.$inferSelect;

/**
 * Extracción automática del listado de facturas recibidas desde el catálogo de la DIAN.
 * La sesión (cookies del portal) se guarda cifrada por organización y dura lo que diga el portal
 * (unos 14 días). Cada extracción es un trabajo con etapas que corre dentro del proceso de la API.
 */
@Injectable()
export class DianExtractionService {
  private readonly logger = new Logger(DianExtractionService.name);
  /** Organizaciones con una extracción en curso en este proceso: una a la vez por organización. */
  private readonly running = new Set<string>();

  constructor(
    @Inject(DB) private readonly db: Database,
    @Inject(CredentialsCipher) private readonly cipher: CredentialsCipher,
    @Inject(ReceivedDocumentsService) private readonly documents: ReceivedDocumentsService,
    @Inject(DIAN_PORTAL_OPTIONS) private readonly portalOptions: DianPortalClientOptions,
  ) {}

  async session(actor: RequestActor): Promise<DianSession> {
    return withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      return this.readSession(tx);
    });
  }

  /**
   * Abre la sesión con el enlace del correo "Token acceso DIAN". El enlace trae el NIT con el que se
   * entra: tiene que ser el de la organización, para no mezclar documentos de otra empresa.
   */
  async connect(actor: RequestActor, { tokenLink }: DianTokenLink): Promise<DianSession> {
    const scope = tenantScope(actor);
    const organizationNit = await withTenant(this.db, scope, async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:import');
      const [organization] = await tx
        .select({ nit: organizations.nit })
        .from(organizations)
        .where(eq(organizations.id, scope.orgId))
        .limit(1);
      if (!organization) throw new NotFoundException('Organization not found');
      return organization.nit;
    });
    const linkNit = new URL(tokenLink).searchParams.get('rk') ?? '';
    if (nitBase(linkNit) !== nitBase(organizationNit)) {
      throw new UnprocessableEntityException(
        `El enlace es de otro NIT (${linkNit}); esta organización es ${organizationNit}`,
      );
    }

    let login: Awaited<ReturnType<typeof DianPortalClient.loginWithTokenLink>>;
    try {
      login = await DianPortalClient.loginWithTokenLink(tokenLink, this.portalOptions);
    } catch (error) {
      if (error instanceof DianPortalError) throw new UnprocessableEntityException(error.message);
      throw error;
    }

    return withTenant(this.db, scope, async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:import');
      const values = {
        // Se guarda el origen completo (https://catalogo-vpfe.dian.gov.co) para volver a entrar.
        host: login.client.origin,
        nit: login.nit,
        cookies: this.cipher.encrypt(JSON.stringify(login.client.jar.toJSON())),
        expiresAt: login.expiresAt,
        connectedBy: actor.userId,
      };
      await tx
        .insert(dianSessions)
        .values({ organizationId: scope.orgId, ...values })
        .onConflictDoUpdate({ target: dianSessions.organizationId, set: values });
      await tx.insert(auditLogs).values({
        organizationId: scope.orgId,
        actorUserId: actor.userId,
        action: 'dian_session.connect',
        resourceType: 'dian_session',
        resourceId: scope.orgId,
        result: 'success',
        metadata: { host: login.host, nit: login.nit, expiresAt: login.expiresAt },
      });
      return this.readSession(tx);
    });
  }

  async disconnect(actor: RequestActor): Promise<void> {
    const scope = tenantScope(actor);
    await withTenant(this.db, scope, async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:import');
      await tx.delete(dianSessions).where(eq(dianSessions.organizationId, scope.orgId));
      await tx.insert(auditLogs).values({
        organizationId: scope.orgId,
        actorUserId: actor.userId,
        action: 'dian_session.disconnect',
        resourceType: 'dian_session',
        resourceId: scope.orgId,
        result: 'success',
      });
    });
  }

  /** Crea el trabajo y lo arranca en segundo plano; el avance se consulta con getJob. */
  async startExtraction(
    actor: RequestActor,
    { startDate, endDate }: DianExtractionRequest,
  ): Promise<DianExtractionJob> {
    const scope = tenantScope(actor);
    const job = await withTenant(this.db, scope, async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:import');
      if (!(await this.readSession(tx)).connected) {
        throw new UnprocessableEntityException(
          'Conecte primero la sesión con la DIAN pegando el enlace del token',
        );
      }
      const [active] = await tx
        .select({ id: dianExtractionJobs.id })
        .from(dianExtractionJobs)
        .where(inArray(dianExtractionJobs.status, ['queued', 'running']))
        .limit(1);
      if (active || this.running.has(scope.orgId)) {
        throw new ConflictException('Ya hay una extracción en curso para esta organización');
      }
      const [row] = await tx
        .insert(dianExtractionJobs)
        .values({ organizationId: scope.orgId, startDate, endDate, requestedBy: actor.userId })
        .returning();
      if (!row) throw new Error('Job insert returned no row');
      await tx.insert(auditLogs).values({
        organizationId: scope.orgId,
        actorUserId: actor.userId,
        action: 'dian_extraction.start',
        resourceType: 'dian_extraction',
        resourceId: row.id,
        result: 'success',
        metadata: { startDate, endDate },
      });
      return row;
    });

    this.running.add(scope.orgId);
    void this.run(actor, scope, job).finally(() => this.running.delete(scope.orgId));
    return toContract(job);
  }

  async listJobs(
    actor: RequestActor,
    { cursor, limit }: CursorPageQuery,
  ): Promise<CursorPage<DianExtractionJob>> {
    return withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      const rows = await tx
        .select()
        .from(dianExtractionJobs)
        .where(afterCursor(dianExtractionJobs, cursor))
        .orderBy(...newestFirst(dianExtractionJobs))
        .limit(limit + 1);
      const page = toCursorPage(rows, limit);
      return { items: page.items.map(toContract), nextCursor: page.nextCursor };
    });
  }

  async getJob(actor: RequestActor, id: string): Promise<DianExtractionJob> {
    return withTenant(this.db, tenantScope(actor), async (tx) => {
      await assertPermission(tx, actor.userId, 'documents:view');
      const [row] = await tx
        .select()
        .from(dianExtractionJobs)
        .where(eq(dianExtractionJobs.id, id))
        .limit(1);
      if (!row) throw new NotFoundException('Extraction not found');
      return toContract(row);
    });
  }

  private async run(actor: RequestActor, scope: TenantScope, job: JobRow): Promise<void> {
    const update = (values: Partial<typeof dianExtractionJobs.$inferInsert>) =>
      withTenant(this.db, scope, (tx) =>
        tx.update(dianExtractionJobs).set(values).where(eq(dianExtractionJobs.id, job.id)),
      );
    const stage = (value: DianExtractionStage) => update({ stage: value });

    try {
      await update({ status: 'running', stage: 'connecting', startedAt: new Date() });
      const stored = await withTenant(this.db, scope, (tx) =>
        tx.select().from(dianSessions).where(eq(dianSessions.organizationId, scope.orgId)).limit(1),
      );
      const session = stored[0];
      if (!session) throw new DianPortalError('session_expired', 'No hay sesión con la DIAN');
      const cookies = JSON.parse(this.cipher.decrypt(session.cookies)) as DianCookie[];
      const client = new DianPortalClient(
        session.host,
        new DianCookieJar(cookies),
        this.portalOptions,
      );
      if (!(await client.isAuthenticated())) {
        throw new DianPortalError('session_expired', 'La sesión con la DIAN venció: pida un token nuevo');
      }

      await stage('requesting_export');
      await client.requestExport(job.startDate, job.endDate);

      await stage('waiting_export');
      const task = await client.waitForExport(job.startDate, job.endDate, (seen) => {
        if (seen?.total !== null && seen?.total !== undefined) {
          void update({ portalTotal: seen.total });
        }
      });

      await stage('downloading');
      const xlsx = await client.downloadExport(task);
      // Las cookies pueden renovarse durante la sesión: se guarda lo último que entregó el portal.
      await withTenant(this.db, scope, (tx) =>
        tx
          .update(dianSessions)
          .set({ cookies: this.cipher.encrypt(JSON.stringify(client.jar.toJSON())) })
          .where(eq(dianSessions.organizationId, scope.orgId)),
      );

      await stage('importing');
      const summary = await this.documents.importListing(
        actor,
        `dian-recibidos-${job.startDate}_${job.endDate}.xlsx`,
        xlsx,
      );
      await update({
        status: 'done',
        stage: 'done',
        portalTotal: task.total,
        importId: summary.importId,
        createdCount: summary.created,
        existingCount: summary.alreadyExisting,
        rejectedCount: summary.rejected.length,
        finishedAt: new Date(),
        message: null,
      });
    } catch (error) {
      const portalError = error instanceof DianPortalError ? error : null;
      if (!portalError) this.logger.error(error);
      await update({
        status: 'error',
        message: portalError?.message ?? 'La extracción falló por un error interno',
        finishedAt: new Date(),
      });
      if (portalError?.code === 'session_expired' || portalError?.code === 'invalid_token') {
        await withTenant(this.db, scope, (tx) =>
          tx.delete(dianSessions).where(eq(dianSessions.organizationId, scope.orgId)),
        );
      }
      await withTenant(this.db, scope, (tx) =>
        tx.insert(auditLogs).values({
          organizationId: scope.orgId,
          actorUserId: actor.userId,
          action: 'dian_extraction.finish',
          resourceType: 'dian_extraction',
          resourceId: job.id,
          result: 'failure',
          metadata: { code: portalError?.code ?? 'internal', message: portalError?.message },
        }),
      );
      return;
    }
    await withTenant(this.db, scope, (tx) =>
      tx.insert(auditLogs).values({
        organizationId: scope.orgId,
        actorUserId: actor.userId,
        action: 'dian_extraction.finish',
        resourceType: 'dian_extraction',
        resourceId: job.id,
        result: 'success',
      }),
    );
  }

  private async readSession(tx: Transaction): Promise<DianSession> {
    const [session] = await tx
      .select({
        host: dianSessions.host,
        nit: dianSessions.nit,
        expiresAt: dianSessions.expiresAt,
        createdAt: dianSessions.updatedAt,
      })
      .from(dianSessions)
      .limit(1);
    if (!session || (session.expiresAt && session.expiresAt.getTime() < Date.now())) {
      return { connected: false, host: null, nit: null, expiresAt: null, connectedAt: null };
    }
    return {
      connected: true,
      host: new URL(session.host).hostname,
      nit: session.nit,
      expiresAt: session.expiresAt?.toISOString() ?? null,
      connectedAt: session.createdAt.toISOString(),
    };
  }
}

/** NIT sin puntos ni dígito de verificación: "900.281.488-6" → "900281488". */
function nitBase(nit: string): string {
  return nit.replace(/[.\s]/g, '').split('-')[0] ?? '';
}

function tenantScope(actor: RequestActor): TenantScope {
  if (!actor.orgId) throw new ForbiddenException('Select an organization first');
  return { orgId: actor.orgId, userId: actor.userId };
}

function toContract(row: JobRow): DianExtractionJob {
  return {
    id: row.id,
    status: row.status,
    stage: row.stage,
    startDate: row.startDate,
    endDate: row.endDate,
    message: row.message,
    portalTotal: row.portalTotal,
    importId: row.importId,
    created: row.createdCount,
    alreadyExisting: row.existingCount,
    rejected: row.rejectedCount,
    requestedBy: row.requestedBy,
    startedAt: row.startedAt?.toISOString() ?? null,
    finishedAt: row.finishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

