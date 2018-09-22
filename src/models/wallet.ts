import {Document} from 'mongoose';

export interface Wallet extends Document {
    wallet_no: any;
    amount: number;
    traveller: any;
    currency: object;
}