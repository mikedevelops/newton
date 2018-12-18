import { createRequest, createResponse } from 'node-mocks-http';
import {
    createResource,
    getPaginatedResources,
    getResource,
    updateResource
} from '../../../src/Controllers/resourceController';
import { Tag, TagModel } from '../../../src/Resources/Tag';
import { Document, Model } from 'mongoose';
import { ObjectID } from 'bson';
import { InstanceType } from 'typegoose';
import * as responseUtilities from '../../../src/Utilities/response';
import * as paginationUtilities from '../../../src/Utilities/pagination';

process.env.TEST_SUITE = 'resource_controller';

// TODO: Mock DB to make this a true unit test

describe('Resource Controller', () => {
    let createErrorResponseSpy: jest.SpyInstance;
    let createResourceResponseSpy: jest.SpyInstance;
    let createPaginatedResponseSpy: jest.SpyInstance;

    beforeEach(() => {
        createErrorResponseSpy = jest.spyOn(responseUtilities, 'createErrorResponse');
        createResourceResponseSpy = jest.spyOn(responseUtilities, 'createResourceResponse');
        createPaginatedResponseSpy = jest.spyOn(paginationUtilities, 'createPaginatedResponse');
    });

    afterEach(() => {
        createErrorResponseSpy.mockClear();
        createResourceResponseSpy.mockClear();
        createPaginatedResponseSpy.mockClear();
    });

    describe('getResource', () => {
        test('should get the first page of paginated resource', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'foo',
                query: {
                    limit: 10,
                    offset: 0
                }
            });

            await getPaginatedResources(TagModel, request, response);

            expect(createPaginatedResponseSpy).toHaveBeenCalled();
        });
    });

    describe('getResource', () => {
        let resource: InstanceType<Tag>;

        beforeEach(async () => {
            resource = await (new TagModel({ name: 'My Tag' })).save();
        });

        test('should get a single resource', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'foo',
                params: {
                    'resource_id': resource._id
                }
            });

            await getResource(TagModel, request, response);

            expect(createResourceResponseSpy).toHaveBeenCalled();
        });

        test('should handle no resource found', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'foo',
                params: {
                    'resource_id': new ObjectID('000000000000')
                }
            });

            await getResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalled();
        });
    });

    describe('createResource', () => {
        test('should create a new resource', async () => {
            const resourceName = 'My Test Resource';
            const response = createResponse();
            const request = createRequest({
                method: 'POST',
                url: 'foo',
                body: {
                    name: resourceName
                }
            });

            await createResource(TagModel, request, response);

            expect(createResourceResponseSpy).toHaveBeenCalled();
        });

        test('should validate the resource schema', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'POST',
                url: 'foo',
                body: {
                    invalid_key: 666
                }
            });

            await createResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalled();
        });
    });

    describe('updateResource', () => {
        let resource: InstanceType<Tag>;

        beforeEach(async () => {
            resource = await (new TagModel({ name: 'My Test Tag' })).save();
        });

        test('should update a resource and return the new one', async () => {
            const updatedName = 'My new name';
            const response = createResponse();
            const request = createRequest({
                method: 'PUT',
                url: 'foo',
                params: {
                    resource_id: resource._id
                },
                body: {
                    name: updatedName
                }
            });

            await updateResource(TagModel, request, response);

            expect(createResourceResponseSpy).toHaveBeenCalled();
        });

        test('should validate the resource schema', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'PUT',
                url: 'foo',
                params: {
                    resource_id: resource._id
                },
                body: {
                    invalid_key: 666
                }
            });

            await updateResource(TagModel, request, response);

            expect(createErrorResponseSpy).toHaveBeenCalled();
        });
    });
});
