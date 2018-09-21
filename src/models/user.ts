import {Document} from 'mongoose';

export interface User extends Document {
    readonly first_name: string;
    readonly last_name: string;
    readonly phone_no: string;
    email: string;
    password: string;
    readonly type: string;
}