import { Request, Response } from 'express';
import { OK } from 'http-status-codes';

/**
 * Status Controller
 * @param request
 * @param response
 */
export default (request: Request, response: Response) => {
    return response.sendStatus(OK);
};
