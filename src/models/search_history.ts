import { Document } from 'mongoose';

export interface SearchHistory extends Document {
    readonly user: any;
    readonly result: any;
}