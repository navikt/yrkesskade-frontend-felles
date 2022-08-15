import { logError } from '@navikt/yrkesskade-logging';
import { Client, TokenSet } from 'openid-client';

export const getOnBehalOfAccessToken = async (
    client: Client,
    token: string | undefined,
    scope: string,
): Promise<TokenSet> => {
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

export default { getOnBehalOfAccessToken };
