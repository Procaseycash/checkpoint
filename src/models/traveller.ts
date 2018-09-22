import {Document} from 'mongoose';

export interface Traveller extends Document {
    readonly first_name: string;
    readonly last_name: string;
    readonly phone_no: string;
    email: string;
    readonly type: string;
}