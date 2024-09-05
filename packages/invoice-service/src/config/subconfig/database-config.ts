import { registerAs } from '@nestjs/config';

export interface IDatabaseConfig {
  uri: string;
}

export default registerAs<IDatabaseConfig>('database', () => ({
  uri: process.env.DATABASE_MONGO_URI,
}));
