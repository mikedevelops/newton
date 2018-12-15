import { model, Schema } from 'mongoose';

const tag = new Schema({
    name: { type: String, required: true }
});

export default model('Tag', tag);
