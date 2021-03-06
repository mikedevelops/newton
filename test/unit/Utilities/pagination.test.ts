import { createRequest, createResponse } from 'node-mocks-http';
import { createPaginatedResponse, parsePaginationQuery } from '../../../src/Utilities/pagination';
import { Model } from 'mongoose';
import { Question, QuestionModel } from '../../../src/Resources/Question';
import { Answer, AnswerModel } from '../../../src/Resources/Answer';
import { Tag, TagModel } from '../../../src/Resources/Tag';
import { Utterance, UtteranceModel } from '../../../src/Resources/Utterance';
import { IM_A_TEAPOT } from 'http-status-codes';
import { IPaginatedResponse } from '../../../src/Interfaces/IPaginatedResponse';

describe('Pagination Utilities', () => {
    describe('parsePaginationQuery', () => {
        test('should parse pagination parameters', () => {
            const request = createRequest({
                method: 'GET',
                url: 'localhost',
                query: {
                    limit: '10',
                    offset: '5'
                }
            });

            expect(parsePaginationQuery(request, 10)).toEqual({
                limit: 10,
                offset: 5
            });
        });

        test('should use the default limit when omitted', () => {
            const request = createRequest({
                method: 'GET',
                url: 'localhost',
                query: {
                    offset: 5
                }
            });

            expect(parsePaginationQuery(request, 100)).toEqual({
                limit: 100,
                offset: 5
            });
        });

        test('should use an offset of 0 when omitted', () => {
            const request = createRequest({
                method: 'GET',
                url: 'localhost',
                query: {
                    limit: 10
                }
            });

            expect(parsePaginationQuery(request, 10)).toEqual({
                limit: 10,
                offset: 0
            });
        });

        test('should handle no pagination parameters', () => {
            const request = createRequest({
                method: 'GET',
                url: 'localhost',
            });

            expect(parsePaginationQuery(request, 100)).toEqual({
                limit: 100,
                offset: 0
            });
        });

        test('should clamp the limit to the max limit', () => {
            const request = createRequest({
                method: 'GET',
                url: 'localhost',
                query: {
                    offset: 5,
                    limit: 1000
                }
            });

            expect(parsePaginationQuery(request, 10)).toEqual({
                limit: 10,
                offset: 5
            });
        });
    });

    describe('createPaginatedResponse', () => {
        const questions: Question[] = [];

        beforeEach(() => {
            for (let index = 0; index < 10; index++) {
                const answer: Answer = new AnswerModel({ text: 'answer' });
                const tag: Tag = new TagModel({ name: 'tag' });
                const utterance: Utterance = new UtteranceModel({ text: 'utterance' });

                questions.push(new QuestionModel({
                    answers: [answer],
                    tags: [tag],
                    utterances: [utterance]
                }));
            }
        });

        test('should return a paginated response', () => {
            const limit = 10;
            const offset = 5;
            const status = IM_A_TEAPOT;
            const expected: IPaginatedResponse = {
                limit,
                offset,
                status,
                result: questions,
                size: questions.length,
                next: 'foo/bar?limit=10&offset=15'
            };

            expect(createPaginatedResponse(questions, status, limit, offset, 'foo/bar')).toEqual(expected);
        });

        test('should omit a next key if we did not get all our results', () => {
            const limit = 10;
            const offset = 5;
            const subset = questions.slice(0, 5);
            const status = IM_A_TEAPOT;
            const expected: IPaginatedResponse = {
                limit,
                offset,
                status,
                result: subset,
                size: subset.length
            };

            expect(createPaginatedResponse(subset, status, limit, offset, 'foo/bar')).toEqual(expected);
        });
    });
});
