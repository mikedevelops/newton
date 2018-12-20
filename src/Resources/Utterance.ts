import mongoose, { Schema } from 'mongoose';

export const Utterance = new Schema({
    text: { type: String, required: true }
});

export const UtteranceModel = mongoose.model('Utterance', Utterance);
