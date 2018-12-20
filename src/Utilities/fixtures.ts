import { QuestionModel } from '../Resources/Question';
import { UtteranceModel } from '../Resources/Utterance';
import { TagModel } from '../Resources/Tag';
import { AnswerModel } from '../Resources/Answer';
import faker from 'faker';
import { getUniqueRandomIndices } from './array';
import { randomInRange } from './number';
import { Model, Document } from 'mongoose';

/**
 * Compose a createAndSaveEntities entity function
 * @param entityCollectionFactory
 * @param entityPersister
 */
export const createAndSaveEntities = async (
    entityCollectionFactory: () => Promise<any>,
    entityPersister: (entities: any) => Promise<any>
) => {
    return async (...factoryArgs: any[]) => {
        return await entityPersister(await entityCollectionFactory.apply(undefined, factoryArgs));
    };
};

/**
 * Save entities
 * @param entityCollection
 */
export const saveEntities = async (entityCollection: Document[]) => {
    const entities = [];

    for (let index = 0; index < entityCollection.length; index++) {
        const entity = entityCollection[index] as InstanceType<any>;

        entities.push(await entity.save());
    }

    return entities;
};

/**
 * Create entities
 * @param factory
 * @param count
 * @param args
 */
export const createEntities = async (
    factory: () => Document,
    count: number,
    ...args: any[]
) => {
    const entities = [];

    for (let index = 0; index < count; index++) {
        entities.push(await factory.apply(undefined, args));
    }

    return entities;
};

/**
 * Create a Question
 * @param tags
 */
export const createQuestion = async (tags: Document[]) => {
    const questionUtterances = await createEntities(createUtterance, randomInRange(1, 20));
    const questionTags = getUniqueRandomIndices(tags, randomInRange(1, 5)).map(index => tags[index]);
    const answer = await createAnswer().save();

    return new QuestionModel({
        tags: questionTags.map(t => t._id),
        utterances: questionUtterances.map(q => q._id),
        answers: [answer._id]
    });
};

/**
 * Create an Utterance
 */
export const createUtterance = () => {
    return new UtteranceModel({ text: faker.lorem.sentence() });
};

/**
 * Create an Answer
 */
export const createAnswer = () => {
    return new AnswerModel({ text: faker.lorem.paragraph() });
};

/**
 * Create a Tag
 */
export const createTag = () => {
    return new TagModel({ name: faker.commerce.department() });
};

/**
 * Create & Save multiple Question HOF
 * @param count
 */
export const boundCreateAndSaveQuestions = async (count: number) => {
    return await createAndSaveEntities(createEntities.bind(undefined, createQuestion, count), saveEntities);
};

/**
 * Create & Save multiple tags HOF
 * @param count
 */
export const boundCreateAndSaveTags = async (count: number) => {
    return await createAndSaveEntities(createEntities.bind(undefined, createTag, count), saveEntities);
};

