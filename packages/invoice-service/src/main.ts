import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/subconfig';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger(bootstrap.name);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  await app.listen(appConfig.port);
  const url = await app.getUrl();
  logger.log(`App is listening on ${url} 🚀`);
}
bootstrap();
