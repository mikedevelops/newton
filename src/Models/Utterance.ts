import { prop, Typegoose } from 'typegoose';

export class Utterance extends Typegoose {
    @prop({ required: true })
    text: string;
}

export const UtteranceModel = new Utterance().getModelForClass(Utterance);
