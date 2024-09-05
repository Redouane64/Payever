import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Invoice } from '../invoice/schemas/invoice.schema';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MAIL_CLIENT_NAME } from './rmq-client';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  private readonly REPORT_CREATED = 'REPORT:CREATED';

  constructor(
    @InjectModel(Invoice.name)
    private readonly invoices: Model<Invoice>,
    @Inject(MAIL_CLIENT_NAME)
    private readonly mailServiceClient: ClientRMQ,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async generateReport() {
    this.logger.debug(`generating report...`);
    await firstValueFrom(
      this.mailServiceClient.emit(this.REPORT_CREATED, { foo: 'bar' }),
    );
  }
}
