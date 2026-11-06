import { Controller, Get, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  type SchemaObject,
} from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import { type HealthReport, HealthService, healthReportSchema } from './health.service.js';

const schema = z.toJSONSchema(healthReportSchema, { target: 'openapi-3.0' }) as SchemaObject;

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Estado de PostgreSQL, Valkey y S3' })
  @ApiOkResponse({ description: 'Todas las dependencias responden', schema })
  @ApiServiceUnavailableResponse({ description: 'Alguna dependencia no responde', schema })
  async check(@Res({ passthrough: true }) reply: FastifyReply): Promise<HealthReport> {
    const report = await this.health.check();
    if (report.status !== 'ok') reply.status(503);
    return report;
  }
}
