import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type InvitationCreate, invitationCreateSchema } from '@telcobras/contracts';
import type { FastifyRequest } from 'fastify';
import { currentActor, OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { ZodPipe } from '../../common/zod.pipe.js';
import { InvitationsService } from './invitations.service.js';

@ApiTags('invitations')
@Controller('invitations')
@UseGuards(SessionGuard)
export class InvitationsController {
  constructor(@Inject(InvitationsService) private readonly invitations: InvitationsService) {}

  @Post()
  @UseGuards(OrganizationGuard)
  @ApiOperation({ summary: 'Invitar un usuario a la organización activa' })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      required: ['id', 'email', 'roleId', 'expiresAt'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        roleId: { type: 'string', format: 'uuid' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  create(
    @Body(new ZodPipe(invitationCreateSchema)) input: InvitationCreate,
    @Req() request: FastifyRequest,
  ) {
    return this.invitations.create(currentActor(request), input);
  }

  @Post(':token/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceptar una invitación a una organización' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      required: ['organizationId'],
      properties: { organizationId: { type: 'string', format: 'uuid' } },
    },
  })
  accept(@Param('token') token: string, @Req() request: FastifyRequest) {
    return this.invitations.accept(currentActor(request), token);
  }
}
