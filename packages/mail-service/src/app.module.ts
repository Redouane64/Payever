import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { MailingModule } from './mailing/mailing.module';

@Module({
  imports: [ConfigModule, MailingModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
