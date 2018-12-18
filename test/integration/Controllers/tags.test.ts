import request from 'supertest';
import { application } from '../../../src';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { Document } from 'mongoose';
import { ObjectID } from 'bson';
import { TagModel } from '../../../src/Resources/Tag';

process.env.TEST_SUITE = 'integration_tags';

describe('GET /tags', () => {
    test('should get tags', async () => {
        await request(application)
            .get('/tags')
            .expect(OK);
    });
});

describe('GET /tags/:tag_id', () => {
    test('should handle not found', async () => {
        await request(application)
            .get(`/tags/${new ObjectID('000000000000')}`)
            .expect(NOT_FOUND);
    });

    test('should get a tag', async () => {
        const tag = (await (new TagModel({ name: 'My Tag' })).save()).toObject();
        const { body } = await request(application)
            .get(`/tags/${tag._id}`)
            .expect(OK);

        expect(body.status).toEqual(OK);
        expect(tag._id.equals(body.result._id)).toBeTruthy();
    });
});

describe('POST /tags', () => {
    test('should validate tag schema', async () => {
        await request(application)
            .post('/tags')
            .send({ invalid_key: 666 })
            .expect(BAD_REQUEST);
    });

    test('should create tag', async () => {
        await request(application)
            .post('/tags')
            .send({ name:  'My New Tag' })
            .expect(OK);
    });
});

describe('PUT /tags/:tag_id', () => {
    test('should handle not found', async () => {
        await request(application)
            .put(`/tags/${new ObjectID('000000000000')}`)
            .send({ name: 'My New Name' })
            .expect(NOT_FOUND);
    });

    test('should validate schema', async () => {
        const tag = (await (new TagModel({ name: 'My Tag' })).save()).toObject();

        await request(application)
            .put(`/tags/${tag._id}`)
            .send({ invalid_key: 666 })
            .expect(BAD_REQUEST);
    });

    test('should update tag and return new tag', async () => {
        const tag = (await (new TagModel({ name: 'My Tag' })).save()).toObject();
        const name = 'My new name';
        const { body } = await request(application)
            .put(`/tags/${tag._id}`)
            .send({ name })
            .expect(OK);

        expect(tag._id.equals(body.result._id)).toBeTruthy();
        expect(body.result.name).toEqual(name);
    });
});
