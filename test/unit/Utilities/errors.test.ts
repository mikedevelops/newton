import { createResourceNotfoundMessage } from '../../../src/Utilities/errors';
import { TagModel } from '../../../src/Resources/Tag';

describe('Error Utilities', () => {
    describe('createResourceNotfoundMessage', () => {
        test('should return the error message', () => {
            expect(createResourceNotfoundMessage(TagModel, '666')).toMatchSnapshot();
        });
    });
});
