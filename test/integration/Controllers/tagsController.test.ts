import { createRequest, createResponse } from 'node-mocks-http';
import { boundCreateAndSaveTags } from '../../../src/Utilities/fixtures';
import { getTags } from '../../../src/Controllers/tagsController';
import { Tag } from '../../../src/Models/Tag';
import { Model } from 'mongoose';
import { IPaginatedResponse } from '../../../src/Interfaces/IPaginatedResponse';

describe('Tags Controller', () => {
    describe('getTags', () => {
        let tags: Tag[];

        beforeEach(async (done) => {
            const createTags = await boundCreateAndSaveTags(20);

            tags = await createTags();
            done();
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
});
