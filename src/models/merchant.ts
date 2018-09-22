import {Document} from 'mongoose';

export interface Merchant extends Document {
    readonly first_name: string;
    readonly last_name: string;
    readonly phone_no: string;
    readonly account_no: string;
    readonly account_name: string;
    readonly bank_code: string;
    readonly bank_name: string;
    readonly email: string;
    readonly merchant_key: string;
}