import { arrayProp, Typegoose } from 'typegoose';
import { Answer } from './Answer';
import { Tag } from './Tag';
import { Utterance } from './Utterance';

export class Question extends Typegoose {
    @arrayProp({ itemsRef: Answer })
    answers: Answer[];

    @arrayProp({ itemsRef: Tag, required: true })
    tags: Tag[];

    @arrayProp({ itemsRef: Utterance, required: true })
    utterances: Utterance[];
}

export const QuestionModel = new Question().getModelForClass(Question, {
    schemaOptions: {
        strict: 'throw'
    }
});
