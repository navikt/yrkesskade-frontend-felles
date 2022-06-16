// eslint-disable-next-line @typescript-eslint/no-unused-vars
import session from 'express-session';
import { IAuthUser } from './typer';

declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: IAuthUser };
    }
}
