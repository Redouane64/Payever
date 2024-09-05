import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
  Transport,
} from '@nestjs/microservices';
import { IRmqConfig } from '../config/subconfig';

export const MAIL_CLIENT_NAME = 'MAIL_CLIENT';

@Injectable()
export class RmqClientFactory implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    const rmqConfig = this.configService.get<IRmqConfig>('rmq');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [rmqConfig.url],
        noAck: true,
        queue: rmqConfig.reportingQueueName,
        prefetchCount: 100,
        queueOptions: {
          durable: false,
        },
      },
    };
  }
}
