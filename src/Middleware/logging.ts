import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

export const logRequest = (logger: Logger) => {
    return (request: Request, response: Response, next: NextFunction) => {
        let output = `[${request.method}] ${request.url}`;

        if (request.method === 'GET') {
            output += ` ${JSON.stringify(request.query)}`;
        }

        if (request.method === 'POST') {
            output += ` ${JSON.stringify(request.body)}`;
        }

        logger.debug(output);
        next();
    };
};

