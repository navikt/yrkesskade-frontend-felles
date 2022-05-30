import { Request } from 'express';
import { logError, logDebug, logInfo, LOG_LEVEL, logWarn } from '@navikt/yrkesskade-logging';

export const logRequest = (req: Request, message: string, level: LOG_LEVEL) => {
    const melding = `${req}: ${message}`;
    const callId = req.header('nav-call-id');
    // eslint-disable-next-line @typescript-eslint/camelcase
    const meta = callId ? { x_callId: callId } : {};
    switch (level) {
        case LOG_LEVEL.DEBUG:
            logDebug(melding, meta);
            break;
        case LOG_LEVEL.INFO:
            logInfo(melding, meta);
            break;
        case LOG_LEVEL.WARNING:
            logWarn(melding, meta);
            break;
        case LOG_LEVEL.ERROR:
            logError(melding, undefined, meta);
            break;
        default:
            logInfo(melding, meta);
    }
};

export const envVar = (navn: string, påkrevd = true, defaultValue?: string): string => {
    const envVariable = process.env[navn];
    if (!envVariable && påkrevd && !defaultValue) {
        logError(`Mangler påkrevd miljøvariabel '${navn}'`);
        process.exit(1);
    }
    if (!envVariable && defaultValue) {
        return defaultValue;
    } else {
        return envVariable as string;
    }
};
