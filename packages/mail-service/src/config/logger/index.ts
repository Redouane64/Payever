import { randomUUID } from 'crypto';
import { LoggerModuleAsyncParams, Params } from 'nestjs-pino';
import pino from 'pino';

export const loggerModuleOptions: LoggerModuleAsyncParams = {
  inject: [],
  useFactory: (): Params => {
    const targets: pino.TransportTargetOptions<Record<string, any>>[] = [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
        },
      },
    ];

    return {
      exclude: ['/healthz', '/swagger', '/favicon.ico'],
      pinoHttp: {
        transport: {
          targets,
        },
        genReqId: () => randomUUID(),
      },
    };
  },
};
