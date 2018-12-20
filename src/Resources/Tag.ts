import mongoose, { Schema } from 'mongoose';

export const Tag = new Schema({
    name: { type: String, required: true }
}, {
    strict: 'throw'
});

export const TagModel = mongoose.model('Tag', Tag);
