import { NextFunction, Request, Response } from 'express';
import logger from '@tablerise/dynamic-logger';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

function ErrorMiddleware(
    err: HttpRequestErrors | Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response | undefined {
    if (!(err instanceof HttpRequestErrors)) {
        logger('error', `error internal throwed - code: 500 [ ${err.name} ]`);
        return res.status(500).send(err.message);
    }

    if (err.redirectTo) {
        logger('error', `error with redirect - redirecting to [ ${err.redirectTo} ]`);
        const urlToRedirect = process.env.URL_TO_REDIRECT ?? 'http://localhost:3000';
        res.redirect(`${urlToRedirect}${err.redirectTo}?error=${err.message}`);
        return;
    }

    return res.status(err.code).json({
        ...err,
        message: err.message,
    });
}

export default ErrorMiddleware;
