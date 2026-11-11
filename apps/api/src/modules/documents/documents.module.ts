import { Module } from '@nestjs/common';
import { OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { CredentialsCipher } from '../../common/credentials-cipher.js';
import { DIAN_PORTAL_OPTIONS, DianExtractionService } from './dian-extraction.service.js';
import { DianController } from './dian.controller.js';
import { DocumentsSettingsController } from './documents-settings.controller.js';
import { DocumentsSettingsService } from './documents-settings.service.js';
import { ReceivedDocumentsController } from './received-documents.controller.js';
import { ReceivedDocumentsService } from './received-documents.service.js';

/**
 * DataDian (módulo 04, identificador interno `documents`): extracción de las facturas recibidas desde
 * el catálogo de la DIAN, bandeja de aprobación y envío a Odoo.
 */
@Module({
  controllers: [ReceivedDocumentsController, DocumentsSettingsController, DianController],
  providers: [
    ReceivedDocumentsService,
    DocumentsSettingsService,
    DianExtractionService,
    CredentialsCipher,
    SessionGuard,
    OrganizationGuard,
    // Ritmo real del portal (entre 10 y 30 segundos por sondeo); las pruebas lo acortan.
    { provide: DIAN_PORTAL_OPTIONS, useValue: {} },
  ],
})
export class DocumentsModule {}
