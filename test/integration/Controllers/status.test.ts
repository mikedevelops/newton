import { OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import mongoose from 'mongoose';
import { app } from '../setup';

process.env.TEST_SUITE = 'integration_status';

describe('Status Integration Test', () => {
    describe('GET /status/api', () => {
        test('should get happy status', async () => {
            await app.get('/status/api')
                .expect(OK);
        });
    });

    describe('GET /status/database', () => {
        test('should get sad status', async () => {
            await mongoose.disconnect();
            await app.get('/status/database')
                .expect(SERVICE_UNAVAILABLE);
        });

        test('should get happy status', async () => {
            await app.get('/status/database')
                .expect(OK);
        });
    });
});
