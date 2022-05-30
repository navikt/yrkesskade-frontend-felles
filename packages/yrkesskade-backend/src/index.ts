import cors from 'cors';
import express, { Express } from 'express';
import headers from './headers';

export interface IApp {
    app: Express;
}

export default async (): Promise<IApp> => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    headers.setup(app);

    // health checks
    app.get([`/internal/isAlive`, `/internal/isReady`], (_req: any, res: any) =>
        res.sendStatus(200),
    );

    const iapp: IApp = {
        app: app,
    };
    return Promise.resolve(iapp);
};

