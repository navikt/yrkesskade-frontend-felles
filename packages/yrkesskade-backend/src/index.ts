import cors from 'cors';
import cookies from 'cookie-parser';
import express, { Express, Request, Response, Router } from 'express';
import headers from './headers';
import { configureAuthenticationAndVerification } from './routes/authenticate';
import configureRouter from './router';

export interface IApp {
    app: Express;
    router: Router;
}

export interface IAppOptions {
    kreverAutentisering: boolean;
}

export default async (options: IAppOptions): Promise<IApp> => {
    const app = express();
    const router = configureRouter();
    app.use(cookies());
    app.use(cors());
    app.use(express.json());

    headers.setup(app);

    // health checks
    app.get([`/internal/isAlive`, `/internal/isReady`], (_req: Request, res: Response) =>
        res.sendStatus(200),
    );

    if (options.kreverAutentisering) {
        configureAuthenticationAndVerification(app);
    }

    const iapp: IApp = {
        app: app,
        router: router,
    };
    return Promise.resolve(iapp);
};
