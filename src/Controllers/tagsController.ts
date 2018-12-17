import { Request, Response } from 'express';
import { TagModel } from '../Models/Tag';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';
import { buildPaginatedResponse, parsePaginationQuery } from '../Utilities/pagination';
import { createErrorResponse } from '../Utilities/response';
import { logger } from '../Services/logger';

export const PAGINATED_TAGS_LIMIT = 50;

/**
 * Get paginated tags
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
        createErrorResponse(response, INTERNAL_SERVER_ERROR, err.message);
    }

    response.json(buildPaginatedResponse(tags, limit, offset, request.url));
};

/**
 * Get a single tag
 * @param request
 * @param response
 */
export const getTag = async (request: Request, response: Response) => {
    const { tag_id } = request.params;
    let tag;

    try {
        tag = await TagModel.findOne({ _id: { $eq: tag_id } });
    } catch (err) {
        logger.error(err.message);
        createErrorResponse(response, INTERNAL_SERVER_ERROR, err.message);
    }

    if (tag === null) {
        createErrorResponse(response, NOT_FOUND, `Could not find Tag with ID "${tag_id}"`);
        return;
    }

    response.json(tag);
};

/**
 * Create a new tag
 * @param request
 * @param response
 */
export const createTag = async (request: Request, response: Response) => {
    const tag = new TagModel({
        name: request.body.name
    });

    try {
        await tag.save();
    } catch (err) {
        logger.error(err.message);
        createErrorResponse(response, INTERNAL_SERVER_ERROR, err.message);
    }

    response.json(tag);
};
