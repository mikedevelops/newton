import { Schema, model } from 'mongoose';
import { ObjectID } from 'bson';

const question = new Schema({
    answers: [{ type: ObjectID, ref: 'Answer' }],
    tags: [{ type: ObjectID, ref: 'Tag', required: true }],
    utterances: [{ type: String, required: true }]
});

export default model('Question', question);
