import {Document} from 'mongoose';

export interface Wallet extends Document {
    wallet_no: any;
    amount: number;
    consumer: any;
    currency: object;
}