import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Invoice } from '../invoice/schemas/invoice.schema';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MAIL_CLIENT_NAME } from './rmq-client';
import { DailySalesReport } from './interfaces';

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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async generateReport() {
    this.logger.debug(`generating report...`);
    const soldItems = await this.invoices
      .aggregate<{ sku: string; qt: number }>([
        {
          // Unwind the items array to separate each item
          $unwind: '$items',
        },
        {
          // Group by SKU and calculate total qt per SKU
          $group: {
            _id: '$items.sku',
            qt: { $sum: '$items.qt' },
          },
        },
        {
          // Project final output structure
          $project: {
            _id: 0,
            sku: '$_id',
            qt: 1,
          },
        },
      ])
      .exec();

    const [summary] = await this.invoices
      .aggregate<{ total: number }>([
        {
          $group: {
            _id: null,
            total: {
              $sum: '$amount',
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .exec();

    await firstValueFrom(
      this.mailServiceClient.emit<unknown, DailySalesReport>(
        this.REPORT_CREATED,
        {
          totalSales: summary.total,
          date: new Date().toDateString(),
          soldItems,
        },
      ),
    );
  }
}
