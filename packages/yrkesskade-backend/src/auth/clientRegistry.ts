import { BaseClient } from 'openid-client';

const clientRegistry: { [key: string]: BaseClient } = {};

const addClient = (key: string, client: BaseClient) => (clientRegistry[key] = client);
const getClient = (key: string) => clientRegistry[key];

export default { addClient, getClient };
