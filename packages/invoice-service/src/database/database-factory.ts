import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { IDatabaseConfig } from '../config/subconfig/database-config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongooseDatabaseFactory implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    const databaseConfig = this.configService.get<IDatabaseConfig>('database');
    const options: MongooseModuleOptions = {
      appName: 'invoice-service',
      uri: databaseConfig.uri,
    };

    return options;
  }
}
