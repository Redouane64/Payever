import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IRmqConfig } from './config/subconfig';
import { ValidationPipe } from '@nestjs/common';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  app.flushLogs();

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: appConfig.nodeEnv === 'production',
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const rmqConfig = configService.get<IRmqConfig>('rmq');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqConfig.url],
      noAck: false,
      queue: rmqConfig.reportingQueueName,
      prefetchCount: 100,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
