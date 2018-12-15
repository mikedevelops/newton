import { prop, Typegoose } from 'typegoose';

export class Answer extends Typegoose {
    @prop()
    text: string;
}

export const AnswerModel = new Answer().getModelForClass(Answer);
