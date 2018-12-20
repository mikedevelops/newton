import mongoose, { Schema } from 'mongoose';

export const Utterance = new Schema({
    text: { type: String, required: true }
}, {
    strict: 'throw'
});

export const UtteranceModel = mongoose.model('Utterance', Utterance);
