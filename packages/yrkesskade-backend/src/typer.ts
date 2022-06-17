import { IdTokenClaims, TokenSet } from 'openid-client';
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
    cluster: 'gcp' | 'fss';
    displayName: string;
    proxyPath: string;
    id: string;
    proxyUrl: string;
}

export interface IAuthUser {
    claims: IdTokenClaims;
    tokenSets: {
        self: TokenSet;
    };
    profile: IUserProfile | IInternalUserProfile 
}

export interface IUserProfile {
    displayName: string;
    identifier: string;
}

export interface IInternalUserProfile extends IUserProfile {
    email: string;
    enhet: string;
    navIdent: string;
    groups: string[];
}