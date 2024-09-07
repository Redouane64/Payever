import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { InvoiceModule } from './invoice/invoice.module';
import { DatabaseModule } from './database/database.module';
import { ReportingModule } from './reporting/reporting.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    InvoiceModule,
    DatabaseModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
