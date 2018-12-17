import { createResponse } from 'node-mocks-http';
import { createErrorResponse } from '../../../src/Utilities/response';
import { NOT_FOUND } from 'http-status-codes';

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
});
