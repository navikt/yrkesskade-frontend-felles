import { logInfo } from '@navikt/yrkesskade-logging';
import { BaseClient, custom } from 'openid-client';

const clientRegistry: { [key: string]: BaseClient } = {};

const addClient = (key: string, client: BaseClient) => {
    clientRegistry[key] = client;
    logInfo(`Klient '${client.metadata.client_id}' lagt til i clientRegistry med nøkkel ${key}`);
};
const getClient = (key: string) => clientRegistry[key];

export default { addClient, getClient };
