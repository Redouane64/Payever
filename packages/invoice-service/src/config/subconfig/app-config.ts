import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  port: number;
  envMode: string;
}

export default registerAs<IAppConfig>('app', () => ({
  port: +process.env.PORT || 5000,
  envMode: process.env.NODE_ENV || 'development',
}));
