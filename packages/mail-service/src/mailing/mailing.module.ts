import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { NodeMailerProvider } from './providers';

@Module({
  providers: [MailingService, NodeMailerProvider],
  exports: [MailingService],
})
export class MailingModule {}
