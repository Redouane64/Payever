import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../invoice/schemas/invoice.schema';
import { ClientsModule } from '@nestjs/microservices';
import { MAIL_CLIENT_NAME, RmqClientFactory } from './rmq-client';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
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
