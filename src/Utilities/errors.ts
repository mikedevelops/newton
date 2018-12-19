import { Model } from 'mongoose';

/**
 * Compose a resource not found error message
 * @param ResourceModel
 * @param resourceId
 */
export const createResourceNotfoundMessage = (ResourceModel: Model<any>, resourceId: string): string => {
    return `Could not find resource "${ResourceModel.modelName}" with ID "${resourceId}"`;
};
