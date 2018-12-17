import { createResponse } from 'node-mocks-http';
import { createErrorResponse, createResourceResponse } from '../../../src/Utilities/response';
import { NOT_FOUND, OK } from 'http-status-codes';

describe('Response Utilities', () => {
    describe('createErrorResponse', () => {
        test('should create an error response', () => {
            const response = createResponse();
            const message = 'These are not the droids you are looking for';

            createErrorResponse(response, NOT_FOUND, message);

            expect(response._getStatusCode()).toEqual(NOT_FOUND);
            expect(JSON.parse(response._getData())).toEqual({
                status: NOT_FOUND,
                message: message
            });
        });
    });

    describe('createResourceResponse', () => {
        test('should create a resource response', () => {
            const response = createResponse();
            const result = [{ foo: 'bar' }];

            createResourceResponse(response, result);

            expect(response._getStatusCode()).toEqual(OK);
            expect(JSON.parse(response._getData())).toEqual({
                status: OK,
                result: result
            });
        });
    });
});
