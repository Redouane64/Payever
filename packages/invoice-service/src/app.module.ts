import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { InvoiceModule } from './invoice/invoice.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule, InvoiceModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
