/* eslint-disable @typescript-eslint/camelcase */
import { logError } from '@navikt/yrkesskade-logging';
import axios from 'axios';
import { Client, GrantExtras, TokenSet } from 'openid-client';
import { NextFunction, Request, Response } from 'express';
import { getTokenFromRequest, hasValidAccessToken, utledAudience } from './tokenUtils';
import { envVar } from '../utils';
import { IService } from '../typer';
import clientRegistry from './clientRegistry';
import { v4 as uuidv4 } from 'uuid';

const getTokenXToken = async (
    client: Client,
    token: string | undefined,
    audience: string,
    additionalClaims: GrantExtras,
): Promise<TokenSet> => {
    if (process.env.ENV === 'local') {
        // Dette skjer kun i lokalt miljø - siden tokenxClient kun blir initialisert i GCP env
        return await getMockTokenXToken(audience);
    }

    let tokenSet;

    try {
        tokenSet = await client.grant(
            {
                grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                audience: audience,
                subject_token: token,
            },
            additionalClaims,
        );
    } catch (error: any) {
        logError(
            `Noe gitt kalt med token exchange mot TokenX.
      Feilmelding fra openid-client: (${error}).
      HTTP Status fra TokenX: (${error.response.statusCode} ${error.response.statusMessage})
      Body fra TokenX `,
            error,
        );
        throw error;
    }

    return tokenSet;
};

const getMockTokenXToken = async (audience: string) => {
    const tokenXUrl = envVar(
        'FAKEDINGS_URL_TOKENX',
        true,
        'https://fakedings.dev-gcp.nais.io/fake/tokenx',
    );
    const tokenXTokenResponse = await await axios.get(
        `${tokenXUrl}?aud=${audience}&acr=Level4&pid=12345678910&client_id=yrkesskade-mock`,
    );

    const tokenxToken = tokenXTokenResponse.data;
    return new TokenSet({
        access_token: tokenxToken,
    });
};

export const exchangeToken = async (client: Client, audience: string, request: Request) => {
    const token = getTokenFromRequest(request);

    const additionalClaims = {
        clientAssertionPayload: {
            nbf: Math.floor(Date.now() / 1000),
            aud: [client.issuer.metadata.token_endpoint],
        },
    };

    if (!token) {
        logError('Kan ikke utføre en token exchange - token finnes ikke');
        throw new Error('Kan ikke utføre en token exchange - token finnes ikke');
    }

    if (!hasValidAccessToken(request)) {
        // token er ugyldig
        throw new Error('Token er ugyldig');
    }

    return await getTokenXToken(client, token, audience, additionalClaims);
};

export const attachTokenX = (
    service: IService,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const klient = clientRegistry.getClient('tokenX');
    const audience = utledAudience(service);
    exchangeToken(klient, audience, req)
        .then((tokenSet: TokenSet) => {
            // sett headere
            req.headers['Nav-Call-Id'] = uuidv4();
            const bearerToken = `Bearer ${tokenSet.access_token}`;
            req.headers.Authorization = bearerToken;
            req.headers.authorization = bearerToken;

            return next();
        })
        .catch(e => {
            logError(`Uventet feil - exchangeToken`, e);
            res.status(500).json({
                status: 'FEILET',
                melding: 'Uventet feil. Vennligst prøv på nytt.',
            });
        });
};

export default { exchangeToken, attachTokenX };
