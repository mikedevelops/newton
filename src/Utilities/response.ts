import { IErrorResponse } from '../Interfaces/IErrorResponse';
import { IResourceResponse } from '../Interfaces/IResourceResponse';

/**
 * Create an error response from the API
 * @param status
 * @param message
 */
export const createErrorResponse = (status: number, message: string): IErrorResponse => {
    return { status, message };
};

/**
 * Create a resource response
 * @param status
 * @param result
 */
export const createResourceResponse = (status: number, result: any): IResourceResponse => {
    return { result, status };
};

