import { InstanceType } from 'typegoose';

export interface IPaginatedResponse {
    next?: string;
    limit: number;
    results: InstanceType<any>[];
    size: number;
    offset: number;
}
