import { Module } from '@nestjs/common';
import { OrganizationGuard, SessionGuard } from '../../auth/session.guard.js';
import { InvitationsController } from './invitations.controller.js';
import { InvitationsService } from './invitations.service.js';

@Module({
  controllers: [InvitationsController],
  providers: [InvitationsService, SessionGuard, OrganizationGuard],
})
export class InvitationsModule {}
