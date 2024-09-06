import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MAIL_CLIENT_NAME } from './rmq-client';
import { DailySalesReport } from './interfaces';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  private readonly REPORT_CREATED = 'REPORT:CREATED';

  constructor(
    private readonly invoiceService: InvoiceService,
    @Inject(MAIL_CLIENT_NAME)
    private readonly mailServiceClient: ClientRMQ,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async generateReport() {
    this.logger.debug(`generating report...`);
    const report = await this.invoiceService.getDailyReport();

    await firstValueFrom(
      this.mailServiceClient.emit<unknown, DailySalesReport>(
        this.REPORT_CREATED,
        report,
      ),
    );
  }
}
