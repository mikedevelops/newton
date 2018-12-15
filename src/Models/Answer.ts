import { model, Schema } from 'mongoose';

const answer = new Schema({
    text: { type: String, required: true }
});

export default model('Answer', answer);
