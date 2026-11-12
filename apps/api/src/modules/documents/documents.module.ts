import { Module } from '@nestjs/common';
import { OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { CredentialsCipher } from '../../common/credentials-cipher.js';
import { DocumentsSettingsController } from './documents-settings.controller.js';
import { DocumentsSettingsService } from './documents-settings.service.js';
import { ReceivedDocumentsController } from './received-documents.controller.js';
import { ReceivedDocumentsService } from './received-documents.service.js';

/**
 * DataDian (módulo 04, identificador interno `documents`): bandeja de facturas recibidas, decisión
 * interna y envío a Odoo. Se reconstruye según docs/modules/documents/ARQUITECTURA_DATADIAN_TELCO.md.
 */
@Module({
  controllers: [ReceivedDocumentsController, DocumentsSettingsController],
  providers: [
    ReceivedDocumentsService,
    DocumentsSettingsService,
    CredentialsCipher,
    SessionGuard,
    OrganizationGuard,
  ],
})
export class DocumentsModule {}
