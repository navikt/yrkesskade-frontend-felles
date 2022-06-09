/* eslint-disable @typescript-eslint/camelcase */
import { logError } from '@navikt/yrkesskade-logging';
import axios from 'axios';
import { Client, GrantExtras, TokenSet } from 'openid-client';
import { Request } from 'express';
import { getTokenFromRequest, hasValidAccessToken } from './tokenUtils';
import { getMockTokenFromIdPorten } from './idportenToken';

const getTokenXToken = async (
    client: Client,
    token: string | undefined,
    additionalClaims: GrantExtras,
) => {
    if (process.env.ENV === 'local') {
        // Dette skjer kun i lokalt miljø - siden tokenxClient kun blir initialisert i GCP env
        return await getMockTokenXToken();
    }

    let tokenSet;

    try {
        tokenSet = await client.grant(
            {
                grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                audience: process.env.TOKENX_AUDIENCE,
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

const getMockTokenXToken = async () => {
    // ?client_id=someclientid&aud=dev-gcp:targetteam:targetapp&acr=Level4&pid=12345678910
    const tokenXTokenResponse = await await axios.get(
        `${process.env.FAKEDINGS_URL_TOKENX}?aud=${process.env.TOKENX_AUDIENCE}&acr=Level4&pid=12345678910&client_id=yrkesskade-saksbehandling`,
    );

    const tokenxToken = tokenXTokenResponse.data;
    return new TokenSet({
        access_token: tokenxToken,
    });
};

export const exchangeToken = async (client: Client, request: Request) => {
    let token = getTokenFromRequest(request);

    const additionalClaims = {
        clientAssertionPayload: {
            nbf: Math.floor(Date.now() / 1000),
            aud: [client.issuer.metadata.token_endpoint],
        },
    };

    if (!token) {
        if (process.env.ENV === 'local') {
            token = await getMockTokenFromIdPorten();
            return await getTokenXToken(client, token, additionalClaims);
        } else {
            // bruker er ikke autentisert
            return;
        }
    }

    if (!hasValidAccessToken(request)) {
        // token er ugyldig
        return;
    }

    return await getTokenXToken(client, token, additionalClaims);
};
