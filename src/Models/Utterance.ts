import { prop, Typegoose } from 'typegoose';

export class Utterance extends Typegoose {
    @prop()
    text: string;
}

export const UtteranceModel = new Utterance().getModelForClass(Utterance);
