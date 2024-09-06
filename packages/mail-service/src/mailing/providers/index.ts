import { Inject, Logger, Provider, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IAppConfig, ISmtpConfig } from '../../config/subconfig';

export type NodeMailer = Transporter<SMTPTransport.SentMessageInfo>;

export const InjectMailingService = Inject.bind(undefined, 'MailingService');

export const NodeMailerProvider: Provider<NodeMailer> = {
  provide: 'MailingService',
  scope: Scope.DEFAULT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const mailingConfig = configService.get<ISmtpConfig>('smtp');
    const transport = createTransport({
      host: mailingConfig.host,
      port: mailingConfig.port,
      auth: {
        user: mailingConfig.username,
        pass: mailingConfig.password,
      },
    });

    const appConfig = configService.get<IAppConfig>('app');

    if (appConfig.nodeEnv === 'production') {
      Logger.debug(`Verifying SMTP configuration...`);
      const verify = await transport.verify();
      if (verify) Logger.debug(`SMTP configuration verified successfully`);
    }

    return transport;
  },
};
