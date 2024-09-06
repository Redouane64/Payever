import { Injectable } from '@nestjs/common';
import { InjectMailingService, NodeMailer } from './providers';

@Injectable()
export class MailingService {
  constructor(
    @InjectMailingService()
    private readonly mailerService: NodeMailer,
  ) {}

  async send(options: { to: string; subject: string; body: string }) {
    await this.mailerService.sendMail({
      to: options.to,
      subject: options.subject,
      html: options.body,
      encoding: 'utf-8',
    });
  }
}
