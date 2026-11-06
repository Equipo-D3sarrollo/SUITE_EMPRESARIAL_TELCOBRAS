import { Module } from '@nestjs/common';
import { OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { OrganizationsController } from './organizations.controller.js';
import { OrganizationsService } from './organizations.service.js';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, SessionGuard, OrganizationGuard],
})
export class OrganizationsModule {}
