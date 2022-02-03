import { IAppConfig } from './typer';
import { envVar } from './utils';

export const appConfig: IAppConfig = {
    clientId: envVar('CLIENT_ID'),
    clientSecret: envVar('CLIENT_SECRET'),
    discoveryUrl: envVar('AAD_DISCOVERY_URL'),
    sessionSecret: envVar('SESSION_SECRET'),
};
