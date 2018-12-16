import { Request, Response } from 'express';
import { TagModel } from '../Models/Tag';
import { logger } from '../index';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { buildPaginatedResponse, parsePaginationQuery } from '../Utilities/pagination';

export const PAGINATED_TAGS_LIMIT = 50;

/**
 * GET Tags
 * @param request
 * @param response
 */
export const getTags = async (request: Request, response: Response) => {
    const { limit, offset } = parsePaginationQuery(request, PAGINATED_TAGS_LIMIT);
    let tags;

    try {
        tags = await TagModel.find({}, {}, { skip: offset, limit: limit });
    } catch (err) {
        logger.error(err.message);
        response.sendStatus(INTERNAL_SERVER_ERROR);
    }

    response.json(buildPaginatedResponse(tags, limit, offset, request.url));
};

/**
 * POST Tags
 * @param request
 * @param response
 */
export const postTags = async (request: Request, response: Response) => {
    const tag = new TagModel({
        name: request.body.name
    });

    try {
        await tag.save();
    } catch (err) {
        logger.error(err.message);
        response.sendStatus(INTERNAL_SERVER_ERROR);
    }

    response.json(tag);
};
