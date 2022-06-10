import { logInfo } from '@navikt/yrkesskade-logging';
import { BaseClient } from 'openid-client';

const clientRegistry: { [key: string]: BaseClient } = {};

const addClient = (key: string, client: BaseClient) => {
    clientRegistry[key] = client;
    logInfo(`${client.issuer} lagt til i clientRegistry med nøkkel ${key}`);
};
const getClient = (key: string) => clientRegistry[key];

export default { addClient, getClient };
