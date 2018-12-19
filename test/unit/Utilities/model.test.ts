import { getReferenceFields } from '../../../src/Utilities/model';
import { Model, Schema } from 'mongoose';

describe('Model Utilities', () => {
    describe('getReferenceFields', () => {
        let OwnerSchema: Schema;
        let PetSchema: Schema;
        let FoodSchema: Schema;

        beforeEach(() => {
            PetSchema = new Schema({
                name: { type: 'String' }
            });

            FoodSchema = new Schema({
                type: { type: 'String' }
            });

            OwnerSchema = new Schema({
                name: String,
                pets: [{ type: PetSchema, ref: 'PetSchema'}],
                food: [{ type: FoodSchema, ref: 'FoodSchema'}]
            });
        });

        test('should return a list of fields that can be populated', () => {
            expect(getReferenceFields(OwnerSchema)).toEqual(['pets', 'food']);
        });
    });
});
