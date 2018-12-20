import { validateAtLeastOneItem } from '../../../src/Validators/array';

describe('Array Validators', () => {
    describe('validateAtLeastOneItem', () => {
        test('should throw on an empty array', () => {
            expect(validateAtLeastOneItem.bind(null, [])).toThrowErrorMatchingSnapshot();
        });

        test('should return true for an array with at least one item', () => {
            expect(validateAtLeastOneItem(['foo'])).toBe(true);
        });
    });
});
