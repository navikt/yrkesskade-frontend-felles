import axios from 'axios';
import { Request, Response } from 'express';

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
    const response = await axios.get(
        `${process.env.FAKEDINGS_URL_IDPORTEN}?pid=12345678910&acr=Level4`,
    );
    const token = await response.data;
    console.log('token: ', token);

    res.redirect(req.query.redirect as string);
};
