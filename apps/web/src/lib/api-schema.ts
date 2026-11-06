import type {
  CursorPage,
  OrganizationCreate,
  Permission,
  ProblemDetails,
} from '@telcobras/contracts';

// shortcut: contrato escrito a mano, con la forma que genera openapi-typescript, solo para los endpoints que usa el shell.
// Cuando contracts exporte los tipos generados (`pnpm --filter @telcobras/contracts generate:api`),
// este archivo se borra y api-client.ts importa `paths` desde @telcobras/contracts.

export type OrganizationSummary = {
  id: string;
  name: string;
  /** Normalizado, sin puntos: "900123456-7". */
  nit: string;
  /** Es la organización activa de la sesión. */
  isActive: boolean;
};

type Json<T> = { content: { 'application/json': T } };
type NoContent = { content?: never };
type Problem = { content: { 'application/problem+json': ProblemDetails } };

export interface paths {
  '/api/v1/me/organizations': {
    get: {
      parameters: { query?: { cursor?: string; limit?: number } };
      responses: { 200: Json<CursorPage<OrganizationSummary>>; default: Problem };
    };
  };
  '/api/v1/me/active-organization': {
    post: {
      requestBody: Json<{ organizationId: string }>;
      responses: { 204: NoContent; default: Problem };
    };
  };
  '/api/v1/me/permissions': {
    get: {
      responses: { 200: Json<{ permissions: Permission[] }>; default: Problem };
    };
  };
  '/api/v1/organizations': {
    post: {
      requestBody: Json<OrganizationCreate>;
      responses: { 201: Json<Omit<OrganizationSummary, 'isActive'>>; default: Problem };
    };
  };
  '/api/v1/invitations/{token}/accept': {
    post: {
      parameters: { path: { token: string } };
      responses: { 200: Json<{ organizationId: string }>; default: Problem };
    };
  };
}
