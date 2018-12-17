import { prop, Typegoose } from 'typegoose';

export class Tag extends Typegoose {
    @prop({ required: true })
    name: string;
}

export const TagModel = new Tag().getModelForClass(Tag, {
    schemaOptions: {
        strict: 'throw'
    }
});
