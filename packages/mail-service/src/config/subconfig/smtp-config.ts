import { registerAs } from '@nestjs/config';

export interface ISmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export default registerAs<ISmtpConfig>('smtp', () => ({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  username: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
}));
