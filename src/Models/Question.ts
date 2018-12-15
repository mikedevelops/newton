import { prop, Typegoose } from 'typegoose';
import { Answer } from './Answer';
import { Tag } from './Tag';
import { Utterance } from './Utterance';

export class Question extends Typegoose {
    @prop()
    answers: Answer[];

    @prop()
    tags: Tag[];

    @prop()
    utterances: Utterance[];
}

export const QuestionModel = new Question().getModelForClass(Question);
