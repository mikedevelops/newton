import { prop, Typegoose } from 'typegoose';

export class Answer extends Typegoose {
    @prop({ required: true })
    text: string;
}

export const AnswerModel = new Answer().getModelForClass(Answer);
