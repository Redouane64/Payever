import appConfig from './app-config';
import rmqConfig from './rmq-config';
import smtpConfig from './smtp-config';

export default [appConfig, rmqConfig, smtpConfig];

export { IAppConfig } from './app-config';
export { IRmqConfig } from './rmq-config';
export { ISmtpConfig } from './smtp-config';
