/* eslint-disable prettier/prettier */
import { logInfo, LOG_LEVEL } from '@navikt/yrkesskade-logging';
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { logRequest } from '../utils';
import * as jose from 'jose';
import { Client, ClientMetadata, Issuer } from 'openid-client';


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
