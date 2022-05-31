import { logInfo, logSecure } from '@navikt/yrkesskade-logging';
import { Express, Request, Response } from 'express';
import { redirectTilLogin } from '../autentisering';

export const configureAuthenticationAndVerification = (app: Express) => {
    app.get(`/redirect-til-login`, (request: Request, response: Response) => {
        redirectTilLogin(request, response);
    });

    app.get(`/innlogget`, (req, res) => {
        const token = req.headers?.authorization?.split(' ')[1];
        if (token) {
            logInfo(`innlogget? ja (token eksisterer)`);
            logSecure(`Bruker innlogget med token (${token})`);
            res.status(200).send();
        } else {
            logInfo(`innlogget? nei (authorization header eller token mangler)`);
            res.status(401).send();
        }
    });
};
