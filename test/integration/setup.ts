import mongoose from 'mongoose';
import request, { SuperTest } from 'supertest';
import { application, server } from '../../src';
import { connectToDatabase } from '../../src/Services/database';

export let app: SuperTest<any>;

// start server before all tests
beforeAll(async (done) => {
    // @ts-ignore
    app = await request(application);
    application.on('ready', done);
});

beforeEach(async () => {
    // Ensure database is connected before each test,
    // some test might want to disconnect to assert errors
    if (mongoose.connection.readyState === 0) {
        await connectToDatabase();
    }

    // Drop database before each test so the database to ensure tests are idempotent
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    // disconnect from database
    await mongoose.disconnect();
    // close server
    await server.close();
});
