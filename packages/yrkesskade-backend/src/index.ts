import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import headers from './headers';
import { configureAuthenticationAndVerification } from './routes/authenticate';

export interface IApp {
    app: Express;
}

export interface IAppOptions {
    kreverAutentisering: boolean;
}

export default async (options: IAppOptions): Promise<IApp> => {
    const app = express();

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
    };
    return Promise.resolve(iapp);
};
