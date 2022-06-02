import { logInfo } from '@navikt/yrkesskade-logging';
import axios from 'axios';
import { Request, Response } from 'express';
import { envVar } from './utils';
import config from './config';

export const redirectTilLogin = async (req: Request, res: Response): Promise<void> => {
    const nodeEnv = process.env.NODE_ENV;
    const env = process.env.ENV;
    if (
        nodeEnv === 'local' ||
        (nodeEnv === 'development' && env === 'local') ||
        nodeEnv === 'labs-gcp'
    ) {
        await redirectTilMock(req, res);
    } else {
        await redirectTilOauth(req, res);
    }
};

const redirectTilOauth = (req: Request, res: Response): Promise<void> => {
    res.redirect(`/oauth2/login?redirect=${req.query.redirect}`);
    return Promise.resolve();
};

const redirectTilMock = async (req: Request, res: Response): Promise<void> => {
    const fakedingsRequest = envVar('FAKEDINGS_TOKEN_REQUEST', true);

    const response = await axios.get(fakedingsRequest);
    const token = await response.data;
    logInfo(`mock token utlevert av ${fakedingsRequest}: ${token}`);

    res.header('Authorization', `Bearer  ${token}`);
    res.cookie(config.COOKIE_NAME, token);
    res.redirect(req.query.redirect as string);
};
