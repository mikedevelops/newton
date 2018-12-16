#! /usr/bin/env node

const meow = require('meow');
const mongoose = require('mongoose');
const faker = require('faker');

const cli = meow(`   
    Options
        --username, -u Mongodb Username
        --password, -p Mongodb Password
        --host, -h Mongodb host 
        --database, -db Database name
        --tags, -t Tag count
        --questions, -q Question count
    
    Examples
        $ ./bin/CreateQuestion.js -u admin -p Admin123! -h localhost:1234 -db local
`, {
    flags: {
        username: {
            type: 'string',
            alias: 'u',
            default: 'newton'
        },
        password: {
            type: 'string',
            alias: 'p',
            default: 'newton'
        },
        host: {
            type: 'string',
            alias: 'h',
            default: 'localhost:27017'
        },
        database: {
            type: 'string',
            alias: 'db',
            default: 'newton'
        },
        tags: {
            type: 'number',
            alias: 't',
            default: 50
        },
        questions: {
            type: 'number',
            alias: 'q',
            default: 2
        }
    }
});

const { username, password, host, database } = cli.flags;
const { QuestionModel } = require('../dist/Models/Question');
const { AnswerModel } = require('../dist/Models/Answer');
const { UtteranceModel } = require('../dist/Models/Utterance');
const { TagModel } = require('../dist/Models/Tag');

mongoose.connect(
    `mongodb://${username}:${password}@${host}/${database}`,
    { useNewUrlParser: true })
    .catch(({ message }) => { throw new Error(message) });

async function createTag () {
    return new TagModel({ name: faker.commerce.department() });
}

function randomInRange (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUniqueRandomIndices (collection, amount) {
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
}

async function createUtterance () {
    return new UtteranceModel({ text: faker.lorem.sentence() });
}

function createAnswer () {
    return new AnswerModel({ text: faker.lorem.paragraph() });
}

async function createEntities (factory, count, ...args) {
    const entities = [];

    for (let index = 0; index < count; index++) {
        entities.push(await factory.apply(null, args));
    }

    return entities;
}

async function createQuestion (tags) {
    const questionUtterances = await createEntities(createUtterance, randomInRange(1, 20));
    const questionTags = getUniqueRandomIndices(tags, randomInRange(1, 5)).map(index => tags[index]);
    const answer = await createAnswer().save();

    return new QuestionModel({
        tags: questionTags.map(t => t._id),
        utterances: questionUtterances.map(q => q._id),
        answers: [answer._id]
    });
}

async function saveEntities (entityCollection) {
    let entities = [];

    for (let index = 0; index < entityCollection.length; index++) {
        entities.push(await entityCollection[index].save());
    }

    return entities;
}

async function save (entityCollectionFactory, entityPersister) {
    return async (...factoryArgs) => {
        return await entityPersister(await entityCollectionFactory.apply(null, factoryArgs));
    }
}

(async function () {
    // Clear database
    await QuestionModel.collection.drop();
    await AnswerModel.collection.drop();
    await TagModel.collection.drop();

    // Compose entity functions
    const saveTags = await save(createEntities.bind(null, createTag, cli.flags.tags), saveEntities);
    const saveQuestions = await save(createEntities.bind(null, createQuestion, cli.flags.questions), saveEntities);

    // Create and save Tags
    const savedTags = await saveTags();

    // Create and save Questions & Answers
    await saveQuestions(savedTags);

    process.exit(1);
})();
