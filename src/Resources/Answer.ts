import mongoose, { Schema } from 'mongoose';

export const Answer = new Schema({
    text: { type: String, required: true }
}, {
    strict: 'throw'
});

export const AnswerModel = mongoose.model('Answer', Answer);
