/**
 * Validate an array has at least 1 item
 * @param array
 */
export const validateAtLeastOneItem = (array: any[]): boolean => {
    if (array.length === 0) {
        throw new Error('Array must contain at least 1 item');
    }

    return true;
};
