import statusController from '../../src/Controllers/statusController';
import { createRequest, createResponse } from 'node-mocks-http';
import { OK } from 'http-status-codes';

describe('Status Controller', () => {
    test('should return an OK status code', () => {
        const request = createRequest({ method: 'GET', url: 'status' });
        const response = createResponse();

        statusController(request, response);

        expect(response._getStatusCode()).toEqual(OK);
    });
});
