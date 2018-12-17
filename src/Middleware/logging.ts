import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

export const logRequest = (logger: Logger) => {
    return (request: Request, response: Response, next: NextFunction) => {
        let output = `[${request.method}] ${request.url}`;

        if (Object.keys(request.query).length > 0) {
            output += ` QUERY: ${JSON.stringify(request.query)}`;
        }

        if (Object.keys(request.body).length > 0) {
            output += ` BODY: ${JSON.stringify(request.body)}`;
        }

        logger.debug(output);
        next();
    };
};

