import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ClientsModule } from '@nestjs/microservices';
import { MAIL_CLIENT_NAME, RmqClientFactory } from './rmq-client';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [
    InvoiceModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: MAIL_CLIENT_NAME,
          useClass: RmqClientFactory,
        },
      ],
    }),
  ],
  providers: [ReportingService],
})
export class ReportingModule {}
