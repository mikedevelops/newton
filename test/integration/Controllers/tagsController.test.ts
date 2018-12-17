import { createRequest, createResponse } from 'node-mocks-http';
import { boundCreateAndSaveTags } from '../../../src/Utilities/fixtures';
import { createTag, getTag, getTags } from '../../../src/Controllers/tagsController';
import { Tag, TagModel } from '../../../src/Models/Tag';
import { Document, Model } from 'mongoose';
import { IPaginatedResponse } from '../../../src/Interfaces/IPaginatedResponse';
import { createErrorResponse } from '../../../src/Utilities/response';
import { mocked } from 'ts-jest/utils';
import { ObjectID } from 'bson';
import { NOT_FOUND, OK } from 'http-status-codes';
import { Response } from 'express';
import mongoose from 'mongoose';
import { escapeRegExp } from 'tslint/lib/utils';

process.env.TEST_SUITE = 'tags-controller';
jest.mock('../../../src/Utilities/response');

describe('Tags Controller', () => {
    beforeEach(() => {
        mocked(createErrorResponse).mockImplementation((res: Response, status: number) => {
            res.status(status).json({error: true});
        });
    });

    describe('getTags', () => {
        let tags: Tag[];

        beforeEach(async () => {
            const createTags = await boundCreateAndSaveTags(20);

            tags = await createTags();
        });

        test('should get the first page of paginated tags', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'tags',
                query: {
                    limit: 10,
                    offset: 0
                }
            });

            await getTags(request, response);
            const parsedResponse: IPaginatedResponse = JSON.parse(response._getData());

            expect(parsedResponse.next).toEqual('tags?limit=10&offset=10');
            expect(parsedResponse.offset).toEqual(0);
            expect(parsedResponse.limit).toEqual(10);
            expect(parsedResponse.size).toEqual(10);
            expect(JSON.stringify(parsedResponse.results)).toEqual(JSON.stringify(tags.slice(0, 10)));
        });

        test('should get the second page of paginated tags', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'tags',
                query: {
                    limit: 10,
                    offset: 10
                }
            });

            await getTags(request, response);
            const parsedResponse: IPaginatedResponse = JSON.parse(response._getData());

            expect(parsedResponse.next).toEqual('tags?limit=10&offset=20');
            expect(parsedResponse.offset).toEqual(10);
            expect(parsedResponse.limit).toEqual(10);
            expect(parsedResponse.size).toEqual(10);
            expect(JSON.stringify(parsedResponse.results)).toEqual(JSON.stringify(tags.slice(10)));
        });

        test('should get the last page of paginated tags', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'tags',
                query: {
                    limit: 10,
                    offset: 20
                }
            });

            await getTags(request, response);
            const parsedResponse: IPaginatedResponse = JSON.parse(response._getData());

            expect(parsedResponse.next).toBeUndefined();
            expect(parsedResponse.offset).toEqual(20);
            expect(parsedResponse.limit).toEqual(10);
            expect(parsedResponse.size).toEqual(0);
            expect(JSON.stringify(parsedResponse.results)).toEqual(JSON.stringify([]));
        });
    });

    describe('getTag', () => {
        let tag: Document;

        beforeEach(async () => {
            tag = await (new TagModel({ name: 'My Tag' })).save();
        });

        test('should get a single tag', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: `tags`,
                params: {
                    'tag_id': tag._id
                }
            });

            await getTag(request, response);

            expect(response._getData()).toEqual(JSON.stringify(tag));
        });

        test('should handle no tag found', async () => {
            const response = createResponse();
            const request = createRequest({
                method: 'GET',
                url: 'tags',
                params: {
                    'tag_id': new ObjectID('000000000000')
                }
            });

            await getTag(request, response);

            expect(response._getStatusCode()).toEqual(NOT_FOUND);
            expect(JSON.parse(response._getData())).toEqual({
                error: true
            });
        });
    });

    describe('createTag', () => {
        test('should create a new tag', async () => {
            const tagName = 'My Test Tag';
            const response = createResponse();
            const request = createRequest({
                method: 'POST',
                url: 'tags',
                body: {
                    name: tagName
                }
            });

            await createTag(request, response);

            const parsedResponse = JSON.parse(response._getData());

            expect(response._getStatusCode()).toEqual(OK);
            expect(parsedResponse.name).toEqual(tagName);
        });
    });
});
