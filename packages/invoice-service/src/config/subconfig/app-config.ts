import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  port: number;
  nodeEnv: string;
}

export default registerAs<IAppConfig>('app', () => ({
  port: +process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
}));
