import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/** Contrato OpenAPI de /api/v1, generado desde los controladores. */
export const buildOpenApiDocument = (app: INestApplication) =>
  SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('OrveX.IA API').setVersion('1').build(),
  );
