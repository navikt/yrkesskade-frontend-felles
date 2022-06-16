import { logInfo, logError } from '@navikt/yrkesskade-logging';
import { Client, GrantBody, TokenSet } from 'openid-client';
import { IApi } from '../typer';
import { getTokenSetsFromSession, hasValidAccessToken } from './tokenUtils';
import { Request } from 'express';

export const getOnBehalOfAccessToken = (
    client: Client,
    grantBody: GrantBody,
    api: IApi,
    req: Request,
): Promise<TokenSet> => {
    return new Promise((resolve, reject) => {
        if (hasValidAccessToken(req)) {
            const tokenSet = getTokenSetsFromSession(req);
            if (tokenSet) {
                resolve(tokenSet);
            } else {
                logError('Feil ved henting av OnBehalfOf token. TokenSet er undefined');
                reject(JSON.stringify('TokenSet er undefined'));
            }
        } else {
            client
                .grant(grantBody)
                .then((tokenSet: TokenSet) => {
                    if (tokenSet.access_token) {
                        resolve(tokenSet);
                    } else {
                        reject(`Token ikke tilgjengelig for ${api.clientId}`);
                    }
                })
                .catch((error: Error) => {
                    const message = error.message;
                    if (message.includes('invalid_grant')) {
                        logInfo(`Bruker har ikke tilgang til ${message}`);
                    } else {
                        logError('Feil ved henting av OnBehalfOf token', error);
                    }
                    reject(JSON.stringify(message));
                });
        }
    });
};

export default { getOnBehalOfAccessToken };
