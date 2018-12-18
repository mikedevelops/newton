import request from 'supertest';
import { application } from '../../../src';
import { OK } from 'http-status-codes';
import { Document } from 'mongoose';

process.env.TEST_SUITE = 'integration_status';

describe('GET /status/api', () => {
    test('should get status', async () => {
        const test = await request(application);

        test.get('/status/api')
            .expect(OK);
    });
});

describe('GET /status/database', () => {
    test('should get happy status', async () => {
        const test = await request(application);

        test.get('/status/database')
            .expect(OK);
    });

    // TODO: Fix this
    // test('should get sad status', async () => {
    //     await request(application)
    //         .get('/status/database')
    //         .expect(SERVICE_UNAVAILABLE);
    // });
});
