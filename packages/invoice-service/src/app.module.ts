import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [ConfigModule, InvoiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
