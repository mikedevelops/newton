import { Answer } from './Answer';
import { Utterance } from './Utterance';
import { Tag } from './Tag';
import mongoose, { Schema } from 'mongoose';

const Question = new Schema({
    answers: [{ type: Schema.Types.ObjectId, required: true, ref: 'Answer' }],
    utterances: [{ type: Schema.Types.ObjectId, required: true, ref: 'Utterance' }],
    tags: [{ type: Schema.Types.ObjectId, required: true, ref: 'Tag' }]
}, {
    strict: 'throw'
});

export const QuestionModel = mongoose.model('Question', Question);
