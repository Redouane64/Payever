import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { MailingModule } from './mailing/mailing.module';
import { LoggerModule } from 'nestjs-pino';
import { loggerModuleOptions } from './config/logger';

@Module({
  imports: [
    LoggerModule.forRootAsync(loggerModuleOptions),
    ConfigModule,
    MailingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
