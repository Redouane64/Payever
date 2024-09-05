import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseDatabaseFactory } from './database-factory';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useClass: MongooseDatabaseFactory,
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
