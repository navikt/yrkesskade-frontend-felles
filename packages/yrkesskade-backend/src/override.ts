import { IAuthUser } from './typer';

declare module 'express-session' {
    export interface SessionData {
        user: IAuthUser;
    }
}
