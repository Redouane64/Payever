import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Response } from 'express';
import { MailingService } from './mailing/mailing.service';
import DailySalesMailTemplate, {
  DailySalesReport,
} from './templates/daily-sales-report.interface';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/subconfig';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly mailingService: MailingService,
    private readonly configService: ConfigService,
  ) {}

  @Get('healthz')
  healthz(@Res() response: Response) {
    return response.sendStatus(HttpStatus.OK);
  }

  @MessagePattern('REPORT:CREATED')
  async onSalesReport(
    @Payload() data: DailySalesReport,
    @Ctx() ctx: RmqContext,
  ) {
    const appConfig = this.configService.get<IAppConfig>('app');

    const html = DailySalesMailTemplate(data);
    await this.mailingService.send({
      to: appConfig.reportTo,
      subject: 'Daily Sales Report',
      html,
    });

    const channel = ctx.getChannelRef();
    const originalMsg = ctx.getMessage();
    channel.ack(originalMsg);
    this.logger.debug(`report sent`);
  }
}
