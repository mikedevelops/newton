import { Request, Response } from 'express';
import URL from 'url';
import { InstanceType } from 'typegoose';
import { IPaginatedResponse } from '../Interfaces/IPaginatedResponse';
import { OK } from 'http-status-codes';

/**
 * Parse pagination parameters from a request
 * @param request
 * @param maxLimit
 */
export const parsePaginationQuery = (
    request: Request,
    maxLimit: number
): { limit: number, offset: number } => {
    let offset = parseInt(request.query.offset, 10);
    let limit = parseInt(request.query.limit, 10);

    // Use a default limit when a limit it omitted
    // Use the max limit when the max limit is exceeded
    if (isNaN(limit) || limit > maxLimit) {
        limit = maxLimit;
    }

    // Ues a default offset if one is omitted
    if (isNaN(offset)) {
        offset = 0;
    }

    return { limit, offset };
};

/**
 * Build a paginated response object
 * @param response
 * @param results
 * @param limit
 * @param offset
 * @param request
 */
export const createPaginatedResponse = (
    response: Response,
    results: InstanceType<any>[],
    limit: number,
    offset: number,
    request: string
) => {
    const url = URL.parse(request);
    const count: number = results.length;
    const body: IPaginatedResponse = {
        limit: limit,
        results: results,
        size: count,
        offset: offset
    };

    // Add next link if we got all of our records
    if (count === limit) {
        body.next = `${url.pathname}?limit=${limit}&offset=${offset + limit}`;
    }

    response.status(OK).json(body);
};
