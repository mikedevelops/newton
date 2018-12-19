#! /usr/bin/env node

const meow = require('meow');
const mongoose = require('mongoose');
const { boundCreateAndSaveQuestions, boundCreateAndSaveTags } = require('../dist/Utilities/fixtures');

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
            default: 20
        },
        questions: {
            type: 'number',
            alias: 'q',
            default: 10
        }
    }
});

const { username, password, host, database } = cli.flags;

(async function () {
    await mongoose.connect(
    `mongodb://${username}:${password}@${host}/${database}`,
    { useNewUrlParser: true });

    // Clear database
    await mongoose.connection.dropDatabase();

    // Compose entity functions
    const saveTags = await boundCreateAndSaveTags(cli.flags.tags);
    const saveQuestions = await boundCreateAndSaveQuestions(cli.flags.questions);

    // Create and createAndSaveEntities Tags
    const savedTags = await saveTags();

    // Create and createAndSaveEntities Questions & Answers
    await saveQuestions(savedTags);

    await mongoose.disconnect();

    console.log(`Created ${cli.flags.tags} Tags and ${cli.flags.questions} Questions`);

    process.exit(1);
})();
