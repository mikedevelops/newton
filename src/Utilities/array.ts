import { randomInRange } from './number';

/**
 * Get a set of random unique indices from an array
 * @param collection
 * @param amount
 */
export const getUniqueRandomIndices = (collection: any[], amount: number) => {
    const indices = [];
    const max = amount >= collection.length ? collection.length : amount;

    for (let index = 0; index < max; index++) {
        const getRandomIndex = randomInRange.bind(this, 0, collection.length - 1);
        let randomIndex;

        do {
            randomIndex = getRandomIndex();
        } while (indices.indexOf(randomIndex) !== -1);

        indices.push(randomIndex);
    }

    return indices;
};
