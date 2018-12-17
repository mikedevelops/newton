import { Response } from 'express';

/**
 * Create an error response from the API
 * @param response
 * @param status
 * @param message
 */
export const createErrorResponse = (response: Response, status: number, message: string) => {
    response.status(status);
    response.json({ status, message });
};

