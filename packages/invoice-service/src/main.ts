import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/subconfig';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  app.flushLogs();

  const logger = new Logger(bootstrap.name);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: appConfig.nodeEnv === 'production',
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(appConfig.port);
  const url = await app.getUrl();
  logger.log(`App is listening on ${url} 🚀`);
}
bootstrap();
