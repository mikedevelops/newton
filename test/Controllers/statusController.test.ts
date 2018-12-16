import { createRequest, createResponse } from 'node-mocks-http';
import { OK } from 'http-status-codes';
import { getStatus } from '../../src/Controllers/statusController';

describe('Status Controller', () => {
    test('should return an OK status code', () => {
        const request = createRequest({ method: 'GET', url: 'status' });
        const response = createResponse();

        getStatus(request, response);

        expect(response._getStatusCode()).toEqual(OK);
    });
});
