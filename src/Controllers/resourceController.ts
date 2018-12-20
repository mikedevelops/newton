import { Request, Response } from 'express';
import { createPaginatedResponse, parsePaginationQuery } from '../Utilities/pagination';
import { Model } from 'mongoose';
import { logger } from '../Services/logger';
import { createErrorResponse, createResourceResponse } from '../Utilities/response';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { createResourceNotfoundMessage } from '../Utilities/errors';
import { getReferenceFields } from '../Utilities/model';

export const PAGINATED_RESOURCE_LIMIT = 20;

/**
 * Get a collection of paginated resources
 * @param ResourceModel
 * @param request
 * @param response
 */
export const getPaginatedResources = async (ResourceModel: Model<any>, request: Request, response: Response) => {
    const { limit, offset } = parsePaginationQuery(request, PAGINATED_RESOURCE_LIMIT);

    let resources;
    const referenceFields = getReferenceFields(ResourceModel.schema);

    try {
        resources = await ResourceModel
            .find({}, {}, { skip: offset, limit: limit })
            .populate(referenceFields.join(' '));
    } catch (err) {
        logger.error(err.message);
        response
            .status(INTERNAL_SERVER_ERROR)
            .json(createErrorResponse(INTERNAL_SERVER_ERROR, err.message));

        return;
    }

    response
        .status(OK)
        .json(createPaginatedResponse(resources, OK, limit, offset, request.url));
};

/**
 * Get a single resource
 * @param ResourceModel
 * @param request
 * @param response
 */
export const getResource = async (ResourceModel: Model<any>, request: Request, response: Response) => {
    const { resource_id } = request.params;
    let resource;

    try {
        resource = await ResourceModel.findOne({ _id: resource_id });
    } catch (err) {
        logger.error(err.message);
        response
            .status(INTERNAL_SERVER_ERROR)
            .json(createErrorResponse(INTERNAL_SERVER_ERROR, err.message));

        return;
    }

    if (resource === null) {
        const message = createResourceNotfoundMessage(ResourceModel, resource_id);

        logger.error(message);
        response
            .status(NOT_FOUND)
            .json(createErrorResponse(NOT_FOUND, message));

        return;
    }

    response
        .status(OK)
        .json(createResourceResponse(OK, resource));
};

/**
 * Create a resource
 * @param ResourceModel
 * @param request
 * @param response
 */
export const createResource = async (ResourceModel: Model<any>, request: Request, response: Response) => {
    let resource;

    try {
        resource = await ResourceModel.create(request.body);
    } catch (err) {
        let status = INTERNAL_SERVER_ERROR;

        if (err.name === 'ValidationError' || err.name === 'StrictModeError') {
            status = BAD_REQUEST;
        }

        logger.error(err.message);
        response
            .status(status)
            .json(createErrorResponse(status, err.message));

        return;
    }

    response
        .status(OK)
        .json(createResourceResponse(OK, resource));
};

/**
 * Update a resource
 * @param ResourceModel
 * @param request
 * @param response
 */
export const updateResource = async (ResourceModel: Model<any>, request: Request, response: Response) => {
    const { resource_id } = request.params;
    let resource: InstanceType<Model<any>>;

    try {
        resource = await ResourceModel.findOne({ _id: resource_id });
    } catch (err) {
        logger.error(err.message);
        response
            .status(INTERNAL_SERVER_ERROR)
            .json(createErrorResponse(INTERNAL_SERVER_ERROR, err.message));

        return;
    }

    if (resource === null) {
        const message = createResourceNotfoundMessage(ResourceModel, resource_id);

        logger.error(message);
        response
            .status(NOT_FOUND)
            .json(createErrorResponse(NOT_FOUND, message));

        return;
    }

    try {
        resource.set({ ...request.body });
        await resource.save();
    } catch (err) {
        let status = INTERNAL_SERVER_ERROR;

        if (err.name === 'StrictModeError') {
            status = BAD_REQUEST;
        }

        logger.error(err.message);
        response
            .status(status)
            .json(createErrorResponse(status, err.message));

        return;
    }

    response
        .status(OK)
        .json(createResourceResponse(OK, resource));
};

/**
 * Remove a single resource
 * @param ResourceModel
 * @param request
 * @param response
 */
export const removeResource = async (ResourceModel: Model<any>, request: Request, response: Response) => {
    const { resource_id } = request.params;
    let resource: InstanceType<Model<any>>;

    try {
        resource = await ResourceModel.findOne({ _id: resource_id });
    } catch (err) {
        logger.error(err.message);
        response
            .status(INTERNAL_SERVER_ERROR)
            .json(createErrorResponse(INTERNAL_SERVER_ERROR, err.message));

        return;
    }

    if (resource === null) {
        const message = createResourceNotfoundMessage(ResourceModel, resource_id);

        logger.error(message);
        response
            .status(NOT_FOUND)
            .json(createErrorResponse(NOT_FOUND, message));

        return;
    }

    try {
        await resource.remove();
    } catch (err) {
        logger.error(err.message);
        response
            .status(INTERNAL_SERVER_ERROR)
            .json(createErrorResponse(INTERNAL_SERVER_ERROR, err.message));

        return;
    }

    response
        .status(OK)
        .json(createResourceResponse(OK, resource));
};
