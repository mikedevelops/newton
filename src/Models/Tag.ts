import { prop, Typegoose } from 'typegoose';

export class Tag extends Typegoose {
    @prop()
    name: string;
}

export const TagModel = new Tag().getModelForClass(Tag);
