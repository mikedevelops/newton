// import { prop, Typegoose } from 'typegoose';
//
// export class Tag extends Typegoose {
//     @prop({ required: true })
//     name: string;
// }
//
// export const TagModel = new Tag().getModelForClass(Tag, {
//     schemaOptions: {
//         strict: 'throw'
//     }
// });

import mongoose, { Schema } from 'mongoose';

export const Tag = new Schema({
    name: { type: String, required: true }
});

export const TagModel = mongoose.model('Tag', Tag);
