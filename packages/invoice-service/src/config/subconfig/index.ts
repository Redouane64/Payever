import appConfig from './app-config';
import databaseConfig from './database-config';
import rmqConfig from './rmq-config';

export default [appConfig, databaseConfig, rmqConfig];

export { IAppConfig } from './app-config';
export { IDatabaseConfig } from './database-config';
export { IRmqConfig } from './rmq-config';
