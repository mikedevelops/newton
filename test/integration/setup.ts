import mongoose from 'mongoose';
import { logger } from '../../src/Services/logger';

async function clear (done: jest.DoneCallback) {
    await mongoose.connection.dropDatabase();
    return done();
}

beforeEach(async done => {
    if (process.env.TEST_SUITE === undefined) {
        return done();
    }

    logger.transports[0].silent = true;

    // TODO: remove this debug
    return done();

    if (mongoose.connection.readyState === 0) {
        const database = `mongodb://localhost:27019/${process.env.TEST_SUITE}`;

        await mongoose.connect(database, {
            useNewUrlParser: true,
            useFindAndModify: false
        });

        logger.info(`Connected to ${database}`);

        return clear(done);
    }

    return clear(done);
});

afterEach(async done => {
    if (process.env.TEST_SUITE === undefined) {
        return done();
    }

    // TODO: remove this debug
    return done();

    await clear(done);
    await mongoose.disconnect();
    return done();
});
