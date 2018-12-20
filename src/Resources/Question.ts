import { Answer } from './Answer';
import { Utterance } from './Utterance';
import { Tag } from './Tag';
import mongoose, { Schema } from 'mongoose';
import { validateAtLeastOneItem } from '../Validators/array';

const Question = new Schema({
    answers: {
        type: [Schema.Types.ObjectId],
        ref: 'Answer'
    },
    utterances: {
        type: [Schema.Types.ObjectId],
        ref: 'Utterance',
        required: true,
        validate: validateAtLeastOneItem
    },
    tags: {
        type: [Schema.Types.ObjectId],
        ref: 'Tag'
    }
}, {
    strict: 'throw'
});

export const QuestionModel = mongoose.model('Question', Question);
