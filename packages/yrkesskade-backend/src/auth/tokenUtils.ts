/* eslint-disable prettier/prettier */
import { logInfo, LOG_LEVEL } from '@navikt/yrkesskade-logging';
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { logRequest } from '../utils';
import * as jose from 'jose';
import { Client, ClientMetadata, ClientOptions, Issuer } from 'openid-client';
import clientRegistry from './clientRegistry';
import { IService } from '../typer';
import { redirectTilLogin } from '../autentisering';

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

/**
 * Oppretter en openid-client og legger klient inn i clientRegistry med key
 * @param key - nøkkel i key-value listen av klienter
 * @param discoveryUrl - url for openid configurasjon
 * @param metadata - metadata for klient
 * @param jwks - eventuelle JWKS nøkler
 * @param options - eventuelle ekstra valg
 * @returns client: Client
 */
export const opprettClient = (
    key: string,
    discoveryUrl: string,
    metadata: ClientMetadata,
    jwks?: { keys: jose.JWK[] } | undefined,
    options?: ClientOptions | undefined,
): Promise<Client> => {
    return Issuer.discover(discoveryUrl).then((issuer: Issuer<Client>) => {
        logInfo(`Discovered issuer ${issuer.issuer}`);
        const client = new issuer.Client(metadata, jwks, options);
        clientRegistry.addClient(key, client);
        return client;
    });
};


export const ensureAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction,
    redirectUrl = '/'
  ) => {
    if (!hasValidAccessToken(req)) {
      //res.status(401).json({ melding: 'ugyldig token - token er utgått' });
      req.query.redirect = redirectUrl;
      redirectTilLogin(req, res);
    } else {
      next();
    }
  };
  

export const utledAudience = (service: IService): string => {
    const env = process.env.ENV === 'prod' ? 'prod' : 'dev';

    return `${env}-${service.cluster}:yrkesskade:${service.id}`;
};

export const utledScope = (appId: string, cluster: 'gcp' | 'fss') => {
    if (process.env.ENV === 'local' && process.env.OVERRIDE_SCOPE) {
        return process.env.OVERRIDE_SCOPE;
    }
    const env = process.env.ENV === 'local' ? 'dev' : process.env.ENV;
    return `api://${env}-${cluster}.yrkesskade.${appId}/.default`;
};

export default {
    utledAudience,
    utledScope,
    ensureAuthenticated,
    opprettClient
}
