import { Response } from 'express';
import { OK } from 'http-status-codes';
import { IErrorResponse } from '../Interfaces/IErrorResponse';
import { IResourceResponse } from '../Interfaces/IResourceResponse';

/**
 * Create an error response from the API
 * @param response
 * @param status
 * @param message
 */
export const createErrorResponse = (response: Response, status: number, message: string) => {
    const body: IErrorResponse = { status, message };

    response.status(status);
    response.json(body);
};

/**
 * Create a resource response
 * @param response
 * @param result
 */
export const createResourceResponse = (response: Response, result: any) => {
    const body: IResourceResponse = { result, status: OK };

    response.status(OK);
    response.json(body);
};

