import promBundle from 'express-prom-bundle';

export const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    metricsPath: '/internal/metrics',
    excludeRoutes: ['/metrics', '/isAlive', '/isReady'],
    promClient: { collectDefaultMetrics: {} },
    formatStatusCode: ({ statusCode }) => {
        if (statusCode >= 200 && statusCode < 400) {
            return '2xx (3xx)';
        }

        return statusCode;
    },
});
