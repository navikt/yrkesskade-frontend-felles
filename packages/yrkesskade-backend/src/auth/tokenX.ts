/* eslint-disable @typescript-eslint/camelcase */
import { logError } from '@navikt/yrkesskade-logging';
import axios from 'axios';
import { Client, GrantExtras, TokenSet } from 'openid-client';
import { Request } from 'express';
import { getTokenFromRequest, hasValidAccessToken } from './tokenUtils';
import { envVar } from '../utils';

const getTokenXToken = async (
    client: Client,
    token: string | undefined,
    audience: string,
    additionalClaims: GrantExtras,
) => {
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
        return;
    }

    if (!hasValidAccessToken(request)) {
        // token er ugyldig
        return;
    }

    return await getTokenXToken(client, token, audience, additionalClaims);
};

export default { exchangeToken };
