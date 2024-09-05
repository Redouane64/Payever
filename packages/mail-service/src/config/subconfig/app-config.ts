import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  envMode: string;
}

export default registerAs<IAppConfig>('app', () => ({
  envMode: process.env.NODE_ENV || 'development',
}));
