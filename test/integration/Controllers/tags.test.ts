import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { Document } from 'mongoose';
import { ObjectID } from 'bson';
import { TagModel } from '../../../src/Resources/Tag';
import { app } from '../setup';

describe('GET /tags', () => {
    test('should get tags', async () => {
        await app.get('/tags')
            .expect(OK);
    });
});

describe('GET /tags/:tag_id', () => {
    test('should handle not found', async () => {
        await app.get(`/tags/${new ObjectID('000000000000')}`)
            .expect(NOT_FOUND);
    });

    test('should get a tag', async () => {
        const tag = (await (new TagModel({ name: 'My Tag' })).save()).toObject();
        const { body } = await app.get(`/tags/${tag._id}`)
            .expect(OK);

        expect(body.status).toEqual(OK);
        expect(tag._id.equals(body.result._id)).toBeTruthy();
    });
});

describe('POST /tags', () => {
    test('should validate tag schema', async () => {
        await app.post('/tags')
            .send({ invalid_key: 666 })
            .expect(BAD_REQUEST);
    });

    test('should create tag', async () => {
        await app.post('/tags')
            .send({ name:  'My New Tag' })
            .expect(OK);
    });
});

describe('PUT /tags/:tag_id', () => {
    test('should handle not found', async () => {
        await app.put(`/tags/${new ObjectID('000000000000')}`)
            .send({ name: 'My New Name' })
            .expect(NOT_FOUND);
    });

    test('should validate schema', async () => {
        const tag = (await (new TagModel({ name: 'My Tag' })).save()).toObject();

        await app.put(`/tags/${tag._id}`)
            .send({ invalid_key: 666 })
            .expect(BAD_REQUEST);
    });

    test('should update tag and return new tag', async () => {
        const tag = (await (new TagModel({ name: 'My Tag' })).save()).toObject();
        const name = 'My new name';
        const { body } = await app.put(`/tags/${tag._id}`)
            .send({ name })
            .expect(OK);

        expect(tag._id.equals(body.result._id)).toBeTruthy();
        expect(body.result.name).toEqual(name);
    });
});

describe('DELETE /tags/:tag_id', () => {
    test('should handle not found', async () => {
        await app.delete(`/tags/${new ObjectID('000000000000')}`)
            .expect(NOT_FOUND);
    });

    test('should remove a tag and return it', async () => {
        const name = 'My Tag to be deleted';
        const tag = await (new TagModel({ name })).save();
        const { body } = await app.delete(`/tags/${tag._id}`)
            .expect(OK);

        expect(tag._id.equals(body.result._id)).toBeTruthy();
        expect(body.result.name).toEqual(name);

        const deletedTag = await TagModel.findOne({ _id: tag._id });

        expect(deletedTag).toBeNull();
    });
});
