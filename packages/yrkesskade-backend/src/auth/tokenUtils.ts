/* eslint-disable prettier/prettier */
import { LOG_LEVEL } from '@navikt/yrkesskade-logging';
import { Request } from 'express';
import config from '../config';
import { logRequest } from '../utils';
import * as jose from 'jose';

export const getOnBehalOfAccessToken = (req: Request): Promise<string> => {
    return new Promise((resolve) => {
        if (hasValidAccessToken(req)) {
            const token = getTokenFromRequest(req);
            if (token) {
                resolve(token);
            }
            throw new Error(`Token mangler i request`);
        } else {
            resolve('har ikke hentet token');
        }
    });
};

export const hasValidAccessToken = (req: Request) => {
    const token = getTokenFromRequest(req);
    if (!token) {
        return loggOgReturnerOmTokenErGyldig(req, false);
    }
    return loggOgReturnerOmTokenErGyldig(req, erUtgått(token) === false);
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
        `Har ${validAccessToken ? 'gyldig' : 'ikke gyldig'}}`,
        LOG_LEVEL.INFO,
    );
    return validAccessToken;
};

const erUtgått = (token: string): boolean => {
    const claims = jose.decodeJwt(token);
    console.log(claims);
    return false;
}
