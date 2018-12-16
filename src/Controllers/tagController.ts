import { Request, Response } from 'express';
import { TagModel } from '../Models/Tag';
import { logger } from '../index';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

/**
 * GET Tags
 * @param request
 * @param response
 */
export const getTags = async (request: Request, response: Response) => {
    let tags;

    try {
        tags = await TagModel.find();
    } catch (err) {
        logger.error(err.message);
        response.sendStatus(INTERNAL_SERVER_ERROR);
    }

    response.json(tags);
};
