import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  type DocumentsSettings,
  type OdooConnectionInput,
  odooConnectionInputSchema,
} from '@telcobras/contracts';
import type { FastifyRequest } from 'fastify';
import { currentActor, OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { ZodPipe } from '../../common/zod.pipe.js';
import { DocumentsSettingsService } from './documents-settings.service.js';

@ApiTags('documents')
@Controller('documents/settings')
@UseGuards(SessionGuard, OrganizationGuard)
export class DocumentsSettingsController {
  constructor(
    @Inject(DocumentsSettingsService) private readonly settings: DocumentsSettingsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Configuración de DataDian (sin secretos)' })
  get(@Req() request: FastifyRequest): Promise<DocumentsSettings> {
    return this.settings.get(currentActor(request));
  }

  @Put('odoo')
  @ApiOperation({ summary: 'Guardar la conexión con Odoo; se prueba antes de guardarla' })
  saveOdoo(
    @Body(new ZodPipe(odooConnectionInputSchema)) input: OdooConnectionInput,
    @Req() request: FastifyRequest,
  ): Promise<DocumentsSettings> {
    return this.settings.saveOdoo(currentActor(request), input);
  }

  @Post('odoo/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Probar la conexión con Odoo guardada' })
  testOdoo(@Req() request: FastifyRequest): Promise<{ ok: true }> {
    return this.settings.testOdoo(currentActor(request));
  }
}
