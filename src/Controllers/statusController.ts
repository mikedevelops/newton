import { Request, Response } from 'express';
import { OK } from 'http-status-codes';

/**
 * GET Status
 * @param request
 * @param response
 */
export const getStatus = (request: Request, response: Response) => {
    return response.sendStatus(OK);
};
