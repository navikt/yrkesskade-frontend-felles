import { logInfo, logError } from '@navikt/yrkesskade-logging';
import { Client, GrantBody, TokenSet } from 'openid-client';
import { IApi } from '../typer';

export const getOnBehalOfAccessToken = (
    client: Client,
    grantBody: GrantBody,
    api: IApi,
): Promise<TokenSet> => {
    return new Promise((resolve, reject) => {
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
    });
};

export default { getOnBehalOfAccessToken };
