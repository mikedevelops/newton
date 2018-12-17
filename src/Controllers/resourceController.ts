import { Request, Response } from 'express';
import { createPaginatedResponse, parsePaginationQuery } from '../Utilities/pagination';
import { Model } from 'mongoose';
import { InstanceType } from 'typegoose';
import { logger } from '../Services/logger';
import { createErrorResponse, createResourceResponse } from '../Utilities/response';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';

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

    try {
        resources = await ResourceModel.find({}, {}, { skip: offset, limit: limit });
    } catch (err) {
        logger.error(err.message);
        createErrorResponse(response, INTERNAL_SERVER_ERROR, err.message);

        return;
    }

    createPaginatedResponse(response, resources, limit, offset, request.url);
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
        createErrorResponse(response, INTERNAL_SERVER_ERROR, err.message);

        return;
    }

    if (resource === null) {
        createErrorResponse(
            response, NOT_FOUND,
            `Could not find resource "${ResourceModel.modelName}" with ID "${resource_id}"`
        );

        return;
    }

    createResourceResponse(response, resource);
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
        resource = new ResourceModel(request.body);
        await resource.save();
    } catch (err) {
        let status = INTERNAL_SERVER_ERROR;

        if (err.name === 'StrictModeError') {
            status = BAD_REQUEST;
        }

        logger.error(err.message);
        createErrorResponse(response, status, err.message);

        return;
    }

    createResourceResponse(response, resource);
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
        resource.set({ ...request.body });
        await resource.save();
    } catch (err) {
        let status = INTERNAL_SERVER_ERROR;

        if (err.name === 'StrictModeError') {
            status = BAD_REQUEST;
        }

        logger.error(err.message);
        createErrorResponse(response, status, err.message);

        return;
    }

    createResourceResponse(response, resource);
};
