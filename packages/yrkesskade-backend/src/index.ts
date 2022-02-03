import express, { Express, Request, Response, Router } from 'express';
import { Client } from 'openid-client';
import passport from 'passport';
import { Counter, Registry } from 'prom-client';
import konfigurerSession from './auth/session';
import konfigurerPassport from './auth/azure/passport';
import { ISessionKonfigurasjon } from './typer';
import { konfigurerMetrikker } from './metrikker';
import { logError, logInfo } from '@navikt/familie-logging';
import axios from 'axios';
import konfigurerRouter from './router';

export interface IApp {
    app: Express;
    azureAuthClient: Client;
    router: Router;
    prometheusRegistry: Registry;
}

export default async (
    sessionKonfigurasjon: ISessionKonfigurasjon,
    prometheusTellere?: { [key: string]: Counter<string> },
): Promise<IApp> => {
    const app = express();
    let azureAuthClient!: Client;
    let router: Router;

    // kubernetes actuators - brukes for å sjekke om backend er oppe og lever
    app.get('/isAlive', (_req: Request, res: Response) => res.status(200).end());
    app.get('/isReady', (_req: Request, res: Response) => res.status(200).end());
    const prometheusRegistry: Registry = konfigurerMetrikker(app, prometheusTellere);

    // hvis i local env så bruker vi fakedings til å gi oss en token
    if (process.env.ENV === 'local') {
        app.get('/oauth2/login', async (_req: Request, res: Response) => {
            logInfo('Henter Fakedings AAD token');
            const token = await axios.get('https://fakedings.dev-gcp.nais.io/fake/aad');
            res.setHeader('Authorization', 'Bearer ' + token);
            res.redirect('/');
        });
    }

    konfigurerSession(app, passport, sessionKonfigurasjon);

    return konfigurerPassport(passport)
        .then((authClient: Client) => {
            azureAuthClient = authClient;
            router = konfigurerRouter(azureAuthClient, prometheusTellere);

            return {
                app,
                azureAuthClient,
                router,
                prometheusRegistry,
            };
        })
        .catch((err: Error) => {
            logError('Feil ved konfigurasjon av azure', err);
            process.exit(1);
        });
};
