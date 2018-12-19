import { Schema } from 'mongoose';

/**
 * Get fields that can populated from a Schema
 * @param ResourceModel
 */
export const getReferenceFields = (ResourceModel: Schema) => {
    const fields: string[] = [];

    ResourceModel.eachPath((path, schema) => {
        // @ts-ignore
        let fieldType = schema.options.type;

        if (Array.isArray(fieldType)) {
            fieldType = fieldType[0];
        }

        if (!Object.hasOwnProperty.call(fieldType, 'ref')) {
            return;
        }

        fields.push(path);
    });

    return fields;
};
