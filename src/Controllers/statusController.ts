import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OK, SERVICE_UNAVAILABLE } from 'http-status-codes';

/**
 * Get API status
 * @param request
 * @param response
 */
export const getApiStatus = (request: Request, response: Response) => {
    response.sendStatus(OK);
};

/**
 * Get database connection status
 * @param request
 * @param response
 */
export const getDatabaseStatus = (request: Request, response: Response) => {
    const status = mongoose.connection.readyState === 1 ? OK : SERVICE_UNAVAILABLE;

    response.sendStatus(status);
};
