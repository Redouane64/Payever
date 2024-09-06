import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  nodeEnv: string;
  reportTo: string;
}

export default registerAs<IAppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  reportTo: process.env.REPORT_TO,
}));
