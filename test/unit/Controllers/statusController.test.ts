import { createRequest, createResponse } from 'node-mocks-http';
import { OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { getApiStatus, getDatabaseStatus } from '../../../src/Controllers/statusController';
import mongoose from 'mongoose';

process.env.TEST_SUITE = 'status-controller';

// TODO: Mock DB to make this a true unit test

describe('Status Controller', () => {
    describe('getApiStatus', () => {
        test('should return an OK status code', () => {
            const request = createRequest({ method: 'GET', url: 'status/api' });
            const response = createResponse();

            getApiStatus(request, response);

            expect(response._getStatusCode()).toEqual(OK);
        });
    });

    describe('getDatabaseStatus', () => {
        test('should return an OK status', () => {
            const request = createRequest({ method: 'GET', url: 'status/database' });
            const response = createResponse();

            getDatabaseStatus(request, response);

            expect(response._getStatusCode()).toEqual(OK);
        });

        test('should return a SERVICE_UNAVAILABLE status', async (done) => {
            const request = createRequest({ method: 'GET', url: 'status/database' });
            const response = createResponse();

            await mongoose.disconnect();

            getDatabaseStatus(request, response);

            expect(response._getStatusCode()).toEqual(SERVICE_UNAVAILABLE);

            return done();
        });
    });
});
