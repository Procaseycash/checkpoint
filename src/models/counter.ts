import { Document } from 'mongoose';

export interface Counter extends Document {
    readonly _id: string;
    readonly seq: number;
}