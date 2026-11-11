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
  UnsupportedMediaTypeException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import {
  type CursorPage,
  type ReceivedDocument,
  type ReceivedDocumentDecision,
  type ReceivedDocumentHistoryEntry,
  type ReceivedDocumentImportSummary,
  type ReceivedDocumentListQuery,
  type ReceivedDocumentPdfUpload,
  type ReceivedDocumentSummary,
  receivedDocumentDecisionSchema,
  receivedDocumentListQuerySchema,
} from '@telcobras/contracts';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { currentActor, OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { ZodPipe } from '../../common/zod.pipe.js';
import { ReceivedDocumentsService } from './received-documents.service.js';

/** El listado (.xlsx) y los PDF viajan como cuerpo binario, sin multipart. */
export const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const PDF_CONTENT_TYPE = 'application/pdf';
export const MAX_LISTING_BYTES = 10 * 1024 * 1024;
export const MAX_PDF_BYTES = 20 * 1024 * 1024;

const fileNameQuery = (fallback: string) =>
  z.object({ fileName: z.string().trim().min(1).max(255).default(fallback) });
const importQuerySchema = fileNameQuery('listado-dian.xlsx');
const pdfQuerySchema = fileNameQuery('factura-dian.pdf');
const idParamSchema = z.uuid();

@ApiTags('documents')
@Controller('documents/received')
@UseGuards(SessionGuard, OrganizationGuard)
export class ReceivedDocumentsController {
  constructor(
    @Inject(ReceivedDocumentsService) private readonly documents: ReceivedDocumentsService,
  ) {}

  @Post('imports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Importar el listado de facturas recibidas que exporta la DIAN' })
  @ApiConsumes(XLSX_CONTENT_TYPE)
  @ApiBody({ schema: { type: 'string', format: 'binary' } })
  importListing(
    @Query(new ZodPipe(importQuerySchema)) query: z.infer<typeof importQuerySchema>,
    @Req() request: FastifyRequest,
  ): Promise<ReceivedDocumentImportSummary> {
    return this.documents.importListing(
      currentActor(request),
      query.fileName,
      binaryBody(request, XLSX_CONTENT_TYPE),
    );
  }

  @Post('pdfs')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cargar el PDF de una factura: se abre con el NIT y se asocia por su CUFE',
  })
  @ApiConsumes(PDF_CONTENT_TYPE)
  @ApiBody({ schema: { type: 'string', format: 'binary' } })
  uploadPdf(
    @Query(new ZodPipe(pdfQuerySchema)) query: z.infer<typeof pdfQuerySchema>,
    @Req() request: FastifyRequest,
  ): Promise<ReceivedDocumentPdfUpload> {
    return this.documents.uploadPdf(
      currentActor(request),
      query.fileName,
      binaryBody(request, PDF_CONTENT_TYPE),
    );
  }

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
  @ApiOperation({ summary: 'PDF de la factura, ya abierto' })
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

function binaryBody(request: FastifyRequest, contentType: string): Buffer {
  if (!Buffer.isBuffer(request.body)) {
    throw new UnsupportedMediaTypeException(`Send the file as ${contentType}`);
  }
  return request.body;
}
