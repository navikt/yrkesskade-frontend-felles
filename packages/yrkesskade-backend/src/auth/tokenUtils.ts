/* eslint-disable prettier/prettier */
import { logError, logInfo, LOG_LEVEL } from '@navikt/yrkesskade-logging';
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { logRequest } from '../utils';
import * as jose from 'jose';
import { Client, ClientMetadata, GrantBody, Issuer, TokenSet } from 'openid-client';
import { IApi } from '../typer';

export const getOnBehalOfAccessToken = (
    client: Client,
    grantBody: GrantBody,
    api: IApi,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        client
            .grant(grantBody)
            .then((tokenSet: TokenSet) => {
                if (tokenSet.access_token) {
                    resolve(tokenSet.access_token);
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

export const hasValidAccessToken = (req: Request) => {
    const token = getTokenFromRequest(req);
    if (!token) {
        return loggOgReturnerOmTokenErGyldig(req, false);
    }
    return loggOgReturnerOmTokenErGyldig(req, isExpired(token) === false);
};

export const getTokenFromRequest = (req: Request): string | undefined => {
    let token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
        token = req.cookies[config.COOKIE_NAME];
    }

    return token;
};

const loggOgReturnerOmTokenErGyldig = (req: Request, validAccessToken: boolean) => {
    logRequest(
        req,
        `Har ${validAccessToken ? 'gyldig token' : 'ikke gyldig token'}}`,
        LOG_LEVEL.INFO,
    );
    return validAccessToken;
};

const isExpired = (token: string): boolean => {
    const claims = jose.decodeJwt(token);
    logInfo(
        `Sjekk om token er utgått:  ${
            claims.exp ? Date.now() < claims.exp * 1000 : true
        } - nå ${Date.now()} - exp: ${claims.exp ? claims.exp * 1000 : 'har ikke exp i claims'}`,
    );
    return claims.exp ? Date.now() >= claims.exp * 1000 : true;
};

export const opprettClient = (discoveryUrl: string, metadata: ClientMetadata): Promise<Client> => {
    return Issuer.discover(discoveryUrl).then((issuer: Issuer<Client>) => {
        logInfo(`Discovered issuer ${issuer.issuer}`);
        return new issuer.Client(metadata);
    });
};

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!hasValidAccessToken(req)) {
        res.status(401).send('{"melding":"ugyldig token"}');
    } else {
        next();
    }
};
