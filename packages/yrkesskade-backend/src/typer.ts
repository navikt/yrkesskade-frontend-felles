/**
 * Service kan benyttes til å definere proxy til eksterne
 * integrasjoner.
 */

export interface IApi {
    clientId: string;
    scopes: string[];
}

export interface IService {
    scope?: string;
    audience?: string;
    cluster: 'gcp' | 'fss';
    displayName: string;
    proxyPath: string;
    id: string;
    proxyUrl: string;
}
