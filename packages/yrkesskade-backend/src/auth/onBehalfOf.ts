/* eslint-disable @typescript-eslint/camelcase */
import { logInfo, logWarn } from '@navikt/yrkesskade-logging';
import { logError } from '@navikt/yrkesskade-logging';
import { NextFunction, Request, Response } from 'express';
import { Client, TokenSet } from 'openid-client';
import { IService } from '../typer';
import clientRegistry from './clientRegistry';
import { getTokenFromRequest, utledScope } from './tokenUtils';
import { v4 as uuidv4 } from 'uuid';

export const getOnBehalOfAccessToken = async (
    client: Client,
    scope: string,
    request: Request,
): Promise<TokenSet> => {
    const token = getTokenFromRequest(request);
    let tokenSet;

    try {
        tokenSet = await client.grant({
            assertion: token,
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            requested_token_use: 'on_behalf_of',
            scope: scope,
        });
    } catch (error: any) {
        logError(
            `Noe gitt kalt med token exchange mot TokenX.
                Feilmelding fra openid-client: (${error}).
                HTTP Status fra Azure AD: (${error.response.statusCode} ${error.response.statusMessage})
                Body fra Azure AD `,
            error,
        );
        throw error;
    }

    return tokenSet;
};

export const attachAzureOBO = (
    service: IService,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const client = clientRegistry.getClient('azureAD');
    const scope = service.scope ? service.scope : utledScope(service.id, service.cluster);
    getOnBehalOfAccessToken(client, scope, req)
        .then((tokenSet: TokenSet) => {
            req.headers['Nav-Call-Id'] = uuidv4();
            const bearerToken = `Bearer ${tokenSet.access_token}`;
            req.headers.Authorization = bearerToken;
            req.headers.authorization = bearerToken;
            logInfo(`request header: ${tokenSet.access_token} - scope: ${scope}`);
            return next();
        })
        .catch(e => {
            if (e.error === 'invalid_grant') {
                logWarn(`invalid_grant`);
                res.status(500).json({
                    status: 'IKKE_TILGANG',
                    frontendFeilmelding:
                        'Uventet feil. Det er mulig at du ikke har tilgang til applikasjonen.',
                });
            } else {
                logError(`Uventet feil - getOnBehalfOfAccessToken`, e);
                res.status(500).json({
                    status: 'FEILET',
                    frontendFeilmelding: 'Uventet feil. Vennligst prøv på nytt.',
                });
            }
        });
};

export default { getOnBehalOfAccessToken, attachAzureOBO };
