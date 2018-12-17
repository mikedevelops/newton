import { createErrorResponse, createResourceResponse } from '../../../src/Utilities/response';
import { IM_A_TEAPOT } from 'http-status-codes';
import { IErrorResponse } from '../../../src/Interfaces/IErrorResponse';
import { IResourceResponse } from '../../../src/Interfaces/IResourceResponse';

describe('Response Utilities', () => {
    describe('createErrorResponse', () => {
        test('should create an error response', () => {
            const message = 'These are not the droids you are looking for';
            const status = IM_A_TEAPOT;
            const expected: IErrorResponse = { message, status };

            expect(createErrorResponse(status, message)).toEqual(expected);
        });
    });

    describe('createResourceResponse', () => {
        test('should create a resource response', () => {
            const result = [{ foo: 'bar' }];
            const status = IM_A_TEAPOT;
            const expected: IResourceResponse = { result, status };

            expect(createResourceResponse(status, result)).toEqual(expected);
        });
    });
});
