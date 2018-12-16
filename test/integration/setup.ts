import mongoose from 'mongoose';

beforeEach(async done => {
    async function clear () {
        await mongoose.connection.dropDatabase();
        return done();
    }

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(`mongodb://localhost:27017/${process.env.TEST_SUITE}`, {
            useNewUrlParser: true
        });
        return clear();
    }

    return clear();
});

afterEach(async done => {
    await mongoose.disconnect();
    return done();
});
