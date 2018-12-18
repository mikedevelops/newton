import request from 'supertest';
import { application } from '../../../src';
import { OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Document } from 'mongoose';
import { logger } from '../../../src/Services/logger';
import mongoose from 'mongoose';

process.env.TEST_SUITE = 'integration_status';
logger.transports[0].silent = true;

describe('GET /status/api', () => {
    test('should get status', async () => {
        await request(application)
            .get('/status/api')
            .expect(OK);
    });
});

describe('GET /status/database', () => {
    test('should get happy status', async () => {
        await request(application)
            .get('/status/database')
            .expect(OK);
    });

    // TODO: Fix this
    // test('should get sad status', async () => {
    //     await request(application)
    //         .get('/status/database')
    //         .expect(SERVICE_UNAVAILABLE);
    // });
});
