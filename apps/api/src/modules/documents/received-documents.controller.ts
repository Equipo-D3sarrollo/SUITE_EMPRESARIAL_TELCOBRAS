import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import {
  type CursorPage,
  type ReceivedDocument,
  type ReceivedDocumentDecision,
  type ReceivedDocumentHistoryEntry,
  type ReceivedDocumentListQuery,
  type ReceivedDocumentSummary,
  receivedDocumentDecisionSchema,
  receivedDocumentListQuerySchema,
} from '@telcobras/contracts';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { currentActor, OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { ZodPipe } from '../../common/zod.pipe.js';
import { ReceivedDocumentsService } from './received-documents.service.js';

const PDF_CONTENT_TYPE = 'application/pdf';
const idParamSchema = z.uuid();

@ApiTags('documents')
@Controller('documents/received')
@UseGuards(SessionGuard, OrganizationGuard)
export class ReceivedDocumentsController {
  constructor(
    @Inject(ReceivedDocumentsService) private readonly documents: ReceivedDocumentsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar las facturas recibidas de la organización activa' })
  list(
    @Query(new ZodPipe(receivedDocumentListQuerySchema)) query: ReceivedDocumentListQuery,
    @Req() request: FastifyRequest,
  ): Promise<CursorPage<ReceivedDocument>> {
    return this.documents.list(currentActor(request), query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Cifras del tablero de DataDian' })
  summary(@Req() request: FastifyRequest): Promise<ReceivedDocumentSummary> {
    return this.documents.summary(currentActor(request));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar una factura recibida' })
  get(
    @Param('id', new ZodPipe(idParamSchema)) id: string,
    @Req() request: FastifyRequest,
  ): Promise<ReceivedDocument> {
    return this.documents.get(currentActor(request), id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'PDF de la factura, si está guardado' })
  @ApiProduces(PDF_CONTENT_TYPE)
  async pdf(
    @Param('id', new ZodPipe(idParamSchema)) id: string,
    @Req() request: FastifyRequest,
  ): Promise<StreamableFile> {
    const { fileName, content } = await this.documents.getPdf(currentActor(request), id);
    return new StreamableFile(content, {
      type: PDF_CONTENT_TYPE,
      disposition: `inline; filename="${fileName.replace(/[^\w.-]/g, '_')}"`,
      length: content.length,
    });
  }

  @Post(':id/decision')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dejar en borrador, aprobar (se envía a Odoo) o rechazar una factura recibida',
  })
  decide(
    @Param('id', new ZodPipe(idParamSchema)) id: string,
    @Body(new ZodPipe(receivedDocumentDecisionSchema)) input: ReceivedDocumentDecision,
    @Req() request: FastifyRequest,
  ): Promise<ReceivedDocument> {
    return this.documents.decide(currentActor(request), id, input);
  }

  @Post(':id/odoo-sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reintentar el envío a Odoo de una factura aprobada' })
  retryOdoo(
    @Param('id', new ZodPipe(idParamSchema)) id: string,
    @Req() request: FastifyRequest,
  ): Promise<ReceivedDocument> {
    return this.documents.retryOdoo(currentActor(request), id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Historial de una factura recibida' })
  history(
    @Param('id', new ZodPipe(idParamSchema)) id: string,
    @Req() request: FastifyRequest,
  ): Promise<ReceivedDocumentHistoryEntry[]> {
    return this.documents.history(currentActor(request), id);
  }
}
