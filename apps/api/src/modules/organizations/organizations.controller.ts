import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  type CursorPage,
  type CursorPageQuery,
  cursorPageQuerySchema,
  type OrganizationCreate,
  organizationCreateSchema,
  type Permission,
  permissionSchema,
} from '@telcobras/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import {
  ACTIVE_ORGANIZATION_COOKIE,
  currentActor,
  OrganizationGuard,
  SessionGuard,
} from '../../auth/session.guard.js';
import { ZodPipe } from '../../common/zod.pipe.js';
import { ENV } from '../../config/config.module.js';
import type { Env } from '../../config/env.js';
import { type OrganizationSummary, OrganizationsService } from './organizations.service.js';

const activeOrganizationSchema = z.object({ organizationId: z.uuid() });

@ApiTags('organizations')
@Controller()
@UseGuards(SessionGuard)
export class OrganizationsController {
  constructor(
    @Inject(OrganizationsService)
    private readonly organizations: OrganizationsService,
    @Inject(ENV) private readonly env: Env,
  ) {}

  @Get('me/organizations')
  @ApiOperation({ summary: 'Listar las organizaciones del usuario autenticado' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      required: ['items', 'nextCursor'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'name', 'nit', 'isActive'],
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              nit: { type: 'string' },
              isActive: { type: 'boolean' },
            },
          },
        },
        nextCursor: { type: 'string', nullable: true },
      },
    },
  })
  async list(
    @Query(new ZodPipe(cursorPageQuerySchema)) query: CursorPageQuery,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<CursorPage<OrganizationSummary>> {
    const actor = currentActor(request);
    const page = await this.organizations.list(actor, query);
    const active = page.items.some((organization) => organization.id === actor.orgId);
    if (!active && !query.cursor && page.items[0]) {
      await this.organizations.setActive(actor, page.items[0].id);
      reply.setCookie(ACTIVE_ORGANIZATION_COOKIE, page.items[0].id, this.cookieOptions());
      return {
        ...page,
        items: page.items.map((organization, index) => ({
          ...organization,
          isActive: index === 0,
        })),
      };
    }
    return page;
  }

  @Post('organizations')
  @ApiOperation({ summary: 'Crear una organización y asignar al creador el rol de propietario' })
  @ApiCreatedResponse({ description: 'Organización creada' })
  create(
    @Body(new ZodPipe(organizationCreateSchema)) input: OrganizationCreate,
    @Req() request: FastifyRequest,
  ): Promise<Omit<OrganizationSummary, 'isActive'>> {
    return this.organizations.create(currentActor(request), input);
  }

  @Post('me/active-organization')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cambiar la organización activa de la sesión' })
  @ApiNoContentResponse({ description: 'Organización activa actualizada' })
  async setActive(
    @Body(new ZodPipe(activeOrganizationSchema)) body: z.infer<typeof activeOrganizationSchema>,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<void> {
    await this.organizations.setActive(currentActor(request), body.organizationId);
    reply.setCookie(ACTIVE_ORGANIZATION_COOKIE, body.organizationId, this.cookieOptions());
  }

  @Get('me/permissions')
  @UseGuards(OrganizationGuard)
  @ApiOperation({ summary: 'Listar permisos de la organización activa' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        permissions: { type: 'array', items: { type: 'string', enum: permissionSchema.options } },
      },
    },
  })
  async permissions(@Req() request: FastifyRequest): Promise<{ permissions: Permission[] }> {
    return { permissions: await this.organizations.permissions(currentActor(request)) };
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      secure: this.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    };
  }
}
