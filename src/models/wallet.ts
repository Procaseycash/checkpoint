import {Document} from 'mongoose';

export interface Wallet extends Document {
    wallet_no: any;
    amount: number;
    point: number;
    traveller: any;
    currency: object;
}