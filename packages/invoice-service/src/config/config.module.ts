import { Module } from '@nestjs/common';
import * as NestConfigModule from '@nestjs/config';
import subconfig from './subconfig';

@Module({
  imports: [
    NestConfigModule.ConfigModule.forRoot({
      load: subconfig,
    }),
  ],
  providers: [NestConfigModule.ConfigService],
  exports: [NestConfigModule.ConfigService],
})
export class ConfigModule {}
