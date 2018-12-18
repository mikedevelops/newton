import mongoose from 'mongoose';

async function clear (done: jest.DoneCallback) {
    await mongoose.connection.dropDatabase();
    return done();
}

beforeEach(async done => {
    if (process.env.TEST_SUITE === undefined) {
        return done();
    }

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(`mongodb://localhost:27017/${process.env.TEST_SUITE}`, {
            useNewUrlParser: true,
            useFindAndModify: false
        });
        return clear(done);
    }

    return clear(done);
});

afterEach(async done => {
    if (process.env.TEST_SUITE === undefined) {
        return done();
    }

    await clear(done);
    await mongoose.disconnect();
    return done();
});
