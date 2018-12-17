import { IResourceResponse } from './IResourceResponse';

export interface IPaginatedResponse extends IResourceResponse {
    next?: string;
    limit: number;
    size: number;
    offset: number;
}
