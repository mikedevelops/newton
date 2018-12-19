import { createRequest, createResponse } from 'node-mocks-http';
import {
    createResource,
    getPaginatedResources,
    getResource, removeResource,
    updateResource
} from '../../../src/Controllers/resourceController';
import { TagModel } from '../../../src/Resources/Tag';
import { Document, Model } from 'mongoose';
import * as responseUtilities from '../../../src/Utilities/response';
import * as paginationUtilities from '../../../src/Utilities/pagination';
import * as errorUtilities from '../../../src/Utilities/errors';
import { createEntities, createTag } from '../../../src/Utilities/fixtures';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { ObjectID } from 'bson';
import { createErrorResponse } from '../../../src/Utilities/response';

describe('Resource Controller', () => {
    let createErrorResponseSpy: jest.SpyInstance;
    let createResourceResponseSpy: jest.SpyInstance;
    let createPaginatedResponseSpy: jest.SpyInstance;
    let parsePaginationQuerySpy: jest.SpyInstance;

    beforeEach(() => {
        createErrorResponseSpy = jest.spyOn(responseUtilities, 'createErrorResponse');
        createResourceResponseSpy = jest.spyOn(responseUtilities, 'createResourceResponse');
        createPaginatedResponseSpy = jest.spyOn(paginationUtilities, 'createPaginatedResponse');
        parsePaginationQuerySpy = jest.spyOn(paginationUtilities, 'parsePaginationQuery');
    });

    afterEach(() => {
        createErrorResponseSpy.mockClear();
        createResourceResponseSpy.mockClear();
        createPaginatedResponseSpy.mockClear();
    });

    describe('getPaginatedResources', () => {
        let TagModelFindSpy: jest.SpyInstance;

        beforeEach(() => {
            TagModelFindSpy = jest.spyOn(TagModel, 'find');
        });

        afterEach(() => {
            TagModelFindSpy.mockClear();
        });

        test('should get the first page of paginated resource', async () => {
            const tags = await createEntities(createTag, 20);
            const offset = 0;
            const limit = 10;
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'foo',
            });

            TagModelFindSpy.mockImplementation(async () => tags.slice(offset, limit));
            parsePaginationQuerySpy.mockImplementation(() => ({ limit, offset }));

            await getPaginatedResources(TagModel, request, response);

            expect(TagModelFindSpy).toHaveBeenCalledWith({}, {}, { skip: offset, limit: limit });
            expect(response._getStatusCode()).toEqual(OK);
            expect(createPaginatedResponseSpy).toHaveBeenCalledWith(
                tags.slice(offset, limit), OK, limit, offset, 'foo');
        });

        test('should handle an error fetching resources', async () => {
            const response = createResponse();
            const error = new Error('Something went wrong!');
            const request = createRequest({
                method: 'GET',
                url: 'foo',
            });

            TagModelFindSpy.mockImplementation(() => {
                throw error;
            });

            await getPaginatedResources(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR, error.message);
            expect(response._getStatusCode()).toEqual(INTERNAL_SERVER_ERROR);
        });
    });

    describe('getResource', () => {
        let TagModelFindOneSpy: jest.SpyInstance;
        let createResourceNotFoundMessageSpy: jest.SpyInstance;


        beforeEach(() => {
            TagModelFindOneSpy = jest.spyOn(TagModel, 'findOne');
            createResourceNotFoundMessageSpy = jest.spyOn(errorUtilities, 'createResourceNotfoundMessage');
        });

        afterEach(() => {
            TagModelFindOneSpy.mockClear();
            createResourceNotFoundMessageSpy.mockClear();
        });

        test('should get a single resource', async () => {
            const tag = createTag();
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'foo',
                params: {
                    'resource_id': tag._id
                }
            });

            TagModelFindOneSpy.mockImplementation(async () => tag);

            await getResource(TagModel, request, response);

            expect(TagModelFindOneSpy).toHaveBeenCalledWith({ _id: tag._id });
            expect(response._getStatusCode()).toEqual(OK);
            expect(createResourceResponseSpy).toHaveBeenCalledWith(OK, tag);
        });

        test('should handle an error fetching a resource', async () => {
            const tag = createTag();
            const response = createResponse();
            const error = new Error('Something went wrong!');
            const request = createRequest({
                method: 'GET',
                url: 'foo',
                params: {
                    'resource_id': tag._id
                }
            });

            TagModelFindOneSpy.mockImplementation(() => {
                throw error;
            });

            await getResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR, error.message);
            expect(response._getStatusCode()).toEqual(INTERNAL_SERVER_ERROR);
        });

        test('should handle no resource found', async () => {
            const response = createResponse();
            const error = 'Something went wrong';
            const id = new ObjectID('000000000000');
            const request = createRequest({
                method: 'GET',
                url: 'foo',
                params: {
                    'resource_id': id
                }
            });

            TagModelFindOneSpy.mockImplementation(async () => null);
            createResourceNotFoundMessageSpy.mockImplementation(() => error);

            await getResource(TagModel, request, response);

            expect(createResourceNotFoundMessageSpy).toHaveBeenCalledWith(TagModel, id);
            expect(createErrorResponseSpy).toHaveBeenCalledWith(NOT_FOUND, error);
            expect(response._getStatusCode()).toEqual(NOT_FOUND);
        });
    });

    describe('createResource', () => {
        let tagModelCreateSpy: jest.SpyInstance;

        beforeEach(() => {
            tagModelCreateSpy = jest.spyOn(TagModel, 'create');
        });

        afterEach(() => {
            tagModelCreateSpy.mockClear();
        });

        test('should create a new resource', async () => {
            const tag = new TagModel({ name: 'My mocked tag' });
            const response = createResponse();
            const request = createRequest({
                method: 'POST',
                url: 'foo'
            });

            tagModelCreateSpy.mockImplementation(() => tag);

            await createResource(TagModel, request, response);

            expect(createResourceResponseSpy).toHaveBeenCalledWith(OK, tag);
            expect(response._getStatusCode()).toEqual(OK);
        });

        test('should handle a schema validation error', async () => {
            const error = new Error('Something went wrong');
            const response = createResponse();
            const request = createRequest({
                method: 'POST',
                url: 'foo'
            });

            error.name = 'ValidationError';
            tagModelCreateSpy.mockImplementation(() => {
                throw error;
            });

            await createResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalledWith(BAD_REQUEST, error.message);
            expect(response._getStatusCode()).toEqual(BAD_REQUEST);
        });

        test('should handle a schema strict error', async () => {
            const error = new Error('Something went wrong');
            const response = createResponse();
            const request = createRequest({
                method: 'POST',
                url: 'foo'
            });

            error.name = 'StrictModeError';
            tagModelCreateSpy.mockImplementation(() => {
                throw error;
            });

            await createResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalledWith(BAD_REQUEST, error.message);
            expect(response._getStatusCode()).toEqual(BAD_REQUEST);
        });

        test('should handle an unknown error', async () => {
            const error = new Error('Something went wrong');
            const response = createResponse();
            const request = createRequest({
                method: 'POST',
                url: 'foo'
            });

            tagModelCreateSpy.mockImplementation(() => {
                throw error;
            });

            await createResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR, error.message);
            expect(response._getStatusCode()).toEqual(INTERNAL_SERVER_ERROR);
        });
    });

    describe('updateResource', () => {
        let tagModelFindOneSpy: jest.SpyInstance;
        let tagModelSetSpy: jest.SpyInstance;
        let tagModelSaveSpy: jest.SpyInstance;
        let createResourceResponseSpy: jest.SpyInstance;
        let createErrorResponseSpy: jest.SpyInstance;
        let createResourceNotfoundMessageSpy: jest.SpyInstance;

        beforeEach(async () => {
            tagModelSetSpy = jest.spyOn(TagModel.prototype, 'set');
            tagModelFindOneSpy = jest.spyOn(TagModel, 'findOne');
            tagModelSaveSpy = jest.spyOn(TagModel.prototype, 'save');
            createResourceResponseSpy = jest.spyOn(responseUtilities, 'createResourceResponse');
            createErrorResponseSpy = jest.spyOn(responseUtilities, 'createErrorResponse');
            createResourceNotfoundMessageSpy = jest.spyOn(errorUtilities, 'createResourceNotfoundMessage');
        });

        afterEach(() => {
            tagModelFindOneSpy.mockClear();
            tagModelSetSpy.mockClear();
            tagModelSaveSpy.mockClear();
            createResourceResponseSpy.mockClear();
            createErrorResponseSpy.mockClear();
            createResourceNotfoundMessageSpy.mockClear();
        });

        test('should update a resource and return the new one', async () => {
            const tag = new TagModel({ name: 'My old Tag' });
            const updatedName = 'My new Tag';
            const response = createResponse();
            const request = createRequest({
                method: 'PUT',
                url: 'foo',
                params: {
                    resource_id: tag._id
                },
                body: {
                    name: updatedName
                }
            });

            tagModelFindOneSpy.mockImplementation(async () => tag);
            tagModelSetSpy.mockImplementation(() => tag);
            tagModelSaveSpy.mockImplementation(async () => {});

            await updateResource(TagModel, request, response);

            expect(tagModelSetSpy).toHaveBeenCalledWith({ name: updatedName });
            expect(tagModelSaveSpy).toHaveBeenCalled();
            expect(createResourceResponseSpy).toHaveBeenCalledWith(OK, tag);
            expect(response._getStatusCode()).toEqual(OK);
        });

        test('should handle error fetching resource', async () => {
            const response = createResponse();
            const error = new Error('Something went wrong');
            const id = new ObjectID('000000000000');
            const request = createRequest({
                method: 'PUT',
                url: 'foo',
                params: {
                    resource_id: id
                }
            });

            tagModelFindOneSpy.mockImplementation(async () => {
                throw error;
            });

            await updateResource(TagModel, request, response);

            expect(tagModelFindOneSpy).toHaveBeenCalledWith({ _id: id });
            expect(createErrorResponseSpy).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR, error.message);
            expect(response._getStatusCode()).toEqual(INTERNAL_SERVER_ERROR);
        });

        test('should handle the resource not existing', async () => {
            const response = createResponse();
            const error = new Error('Something went wrong');
            const id = new ObjectID('000000000000');
            const request = createRequest({
                method: 'PUT',
                url: 'foo',
                params: {
                    resource_id: id
                }
            });

            tagModelFindOneSpy.mockImplementation(async () => null);
            createResourceNotfoundMessageSpy.mockImplementation(() => error.message);

            await updateResource(TagModel, request, response);

            expect(tagModelFindOneSpy).toHaveBeenCalledWith({ _id: id });
            expect(createResourceNotfoundMessageSpy).toHaveBeenCalledWith(TagModel, id);
            expect(createErrorResponseSpy).toHaveBeenCalledWith(NOT_FOUND, error.message);
            expect(response._getStatusCode()).toEqual(NOT_FOUND);
        });

        test('should handle an unknown error saving the resource', async () => {
            const tag = new TagModel({ name: 'My old Tag' });
            const updatedName = 'My new Tag';
            const error = new Error('Something went wrong');
            const response = createResponse();
            const request = createRequest({
                method: 'PUT',
                url: 'foo',
                params: {
                    resource_id: tag._id
                },
                body: {
                    name: updatedName
                }
            });

            tagModelFindOneSpy.mockImplementation(async () => tag);
            tagModelSetSpy.mockImplementation(() => tag);
            tagModelSaveSpy.mockImplementation(async () => {
                throw error;
            });

            await updateResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR, error.message);
            expect(response._getStatusCode()).toEqual(INTERNAL_SERVER_ERROR);
        });

        test('should handle a schema error saving the resource', async () => {
            const tag = new TagModel({ name: 'My old Tag' });
            const updatedName = 'My new Tag';
            const error = new Error('Something went wrong');
            const response = createResponse();
            const request = createRequest({
                method: 'PUT',
                url: 'foo',
                params: {
                    resource_id: tag._id
                },
                body: {
                    name: updatedName
                }
            });

            error.name = 'StrictModeError';
            tagModelFindOneSpy.mockImplementation(async () => tag);
            tagModelSetSpy.mockImplementation(() => tag);
            tagModelSaveSpy.mockImplementation(async () => {
                throw error;
            });

            await updateResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalledWith(BAD_REQUEST, error.message);
            expect(response._getStatusCode()).toEqual(BAD_REQUEST);
        });
    });

    describe('removeResource', () => {
        let tagModelFindOneSpy: jest.SpyInstance;
        let tagModelRemoveSpy: jest.SpyInstance;
        let createResourceNotfoundMessageSpy: jest.SpyInstance;
        let createErrorResponseSpy: jest.SpyInstance;
        let createResourceResponse: jest.SpyInstance;

        beforeEach(() => {
            tagModelFindOneSpy = jest.spyOn(TagModel, 'findOne');
            tagModelRemoveSpy = jest.spyOn(TagModel.prototype, 'remove');
            createResourceNotfoundMessageSpy = jest.spyOn(errorUtilities, 'createResourceNotfoundMessage');
            createErrorResponseSpy = jest.spyOn(responseUtilities, 'createErrorResponse');
            createResourceResponse = jest.spyOn(responseUtilities, 'createResourceResponse');
        });

        afterEach(() => {
            tagModelFindOneSpy.mockClear();
            tagModelRemoveSpy.mockClear();
            createResourceNotfoundMessageSpy.mockClear();
            createErrorResponseSpy.mockClear();
            createErrorResponseSpy.mockClear();
        });

        test('should remove a resource and return it', async () => {
            const tag = createTag();
            const response = createResponse();
            const request = createRequest({
                method: 'DELETE',
                url: 'foo',
                params: {
                    resource_id: tag._id
                }
            });

            tagModelFindOneSpy.mockImplementation(async () => tag);
            tagModelRemoveSpy.mockImplementation(async () => {});

            await removeResource(TagModel, request, response);

            expect(tagModelFindOneSpy).toHaveBeenCalledWith({ _id: tag._id });
            expect(tagModelRemoveSpy).toHaveBeenCalled();
            expect(response._getStatusCode()).toEqual(OK);
            expect(createResourceResponseSpy).toHaveBeenCalledWith(OK, tag);
        });

        test('should handle an unknown error when finding a resource', async () => {
            const tag = createTag();
            const error = new Error('Something went wrong');
            const response = createResponse();
            const request = createRequest({
                method: 'DELETE',
                url: 'foo',
                params: {
                    resource_id: tag._id
                }
            });

            tagModelFindOneSpy.mockImplementation(async () => {
                throw error;
            });

            await removeResource(TagModel, request, response);

            expect(response._getStatusCode()).toEqual(INTERNAL_SERVER_ERROR);
            expect(createErrorResponseSpy).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR, error.message);
        });

        test('should handle the resource not being found', async () => {
            const tag = createTag();
            const error = new Error('Something went wrong');
            const response = createResponse();
            const request = createRequest({
                method: 'DELETE',
                url: 'foo',
                params: {
                    resource_id: tag._id
                }
            });

            tagModelFindOneSpy.mockImplementation(async () => null);
            createResourceNotfoundMessageSpy.mockImplementation(() => error.message);

            await removeResource(TagModel, request, response);

            expect(createResourceNotfoundMessageSpy).toHaveBeenCalledWith(TagModel, tag._id);
            expect(createErrorResponseSpy).toHaveBeenCalledWith(NOT_FOUND, error.message);
            expect(response._getStatusCode()).toEqual(NOT_FOUND);
        });

        test('should handle an unknown error removing a resource', async () => {
            const tag = createTag();
            const error = new Error('Something went wrong');
            const response = createResponse();
            const request = createRequest({
                method: 'DELETE',
                url: 'foo',
                params: {
                    resource_id: tag._id
                }
            });

            tagModelFindOneSpy.mockImplementation(async () => tag);
            tagModelRemoveSpy.mockImplementation(async () => {
                throw error;
            });

            await removeResource(TagModel, request, response);

            expect(tagModelFindOneSpy).toHaveBeenCalledWith({ _id: tag._id });
            expect(tagModelRemoveSpy).toHaveBeenCalled();
            expect(response._getStatusCode()).toEqual(INTERNAL_SERVER_ERROR);
            expect(createErrorResponseSpy).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR, error.message);
        });
    });
});
