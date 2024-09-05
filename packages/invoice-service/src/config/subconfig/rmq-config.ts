import { registerAs } from '@nestjs/config';

export interface IRmqConfig {
  url: string;
  reportingQueueName: string;
}

export default registerAs<IRmqConfig>('rmq', () => ({
  url: process.env.RMQ_URL,
  reportingQueueName: process.env.REPORTING_QUEUE_NAME,
}));
