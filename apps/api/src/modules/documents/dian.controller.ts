import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  type CursorPage,
  type CursorPageQuery,
  cursorPageQuerySchema,
  type DianExtractionJob,
  type DianExtractionRequest,
  type DianSession,
  type DianTokenLink,
  dianExtractionRequestSchema,
  dianTokenLinkSchema,
} from '@telcobras/contracts';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { currentActor, OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { ZodPipe } from '../../common/zod.pipe.js';
import { DianExtractionService } from './dian-extraction.service.js';

const idParamSchema = z.uuid();

/** DataDian: sesión con el catálogo de la DIAN y extracciones del listado de recibidos. */
@ApiTags('documents')
@Controller('documents/dian')
@UseGuards(SessionGuard, OrganizationGuard)
export class DianController {
  constructor(@Inject(DianExtractionService) private readonly dian: DianExtractionService) {}

  @Get('session')
  @ApiOperation({ summary: 'Estado de la sesión con el catálogo de la DIAN' })
  session(@Req() request: FastifyRequest): Promise<DianSession> {
    return this.dian.session(currentActor(request));
  }

  @Put('session')
  @ApiOperation({ summary: 'Conectar con la DIAN usando el enlace del correo "Token acceso DIAN"' })
  connect(
    @Body(new ZodPipe(dianTokenLinkSchema)) input: DianTokenLink,
    @Req() request: FastifyRequest,
  ): Promise<DianSession> {
    return this.dian.connect(currentActor(request), input);
  }

  @Delete('session')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cerrar la sesión guardada con la DIAN' })
  disconnect(@Req() request: FastifyRequest): Promise<void> {
    return this.dian.disconnect(currentActor(request));
  }

  @Post('extractions')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Extraer de la DIAN las facturas recibidas de un rango de fechas' })
  start(
    @Body(new ZodPipe(dianExtractionRequestSchema)) input: DianExtractionRequest,
    @Req() request: FastifyRequest,
  ): Promise<DianExtractionJob> {
    return this.dian.startExtraction(currentActor(request), input);
  }

  @Get('extractions')
  @ApiOperation({ summary: 'Extracciones recientes, de la más nueva a la más antigua' })
  list(
    @Query(new ZodPipe(cursorPageQuerySchema)) query: CursorPageQuery,
    @Req() request: FastifyRequest,
  ): Promise<CursorPage<DianExtractionJob>> {
    return this.dian.listJobs(currentActor(request), query);
  }

  @Get('extractions/:id')
  @ApiOperation({ summary: 'Avance y resultado de una extracción' })
  get(
    @Param('id', new ZodPipe(idParamSchema)) id: string,
    @Req() request: FastifyRequest,
  ): Promise<DianExtractionJob> {
    return this.dian.getJob(currentActor(request), id);
  }
}
