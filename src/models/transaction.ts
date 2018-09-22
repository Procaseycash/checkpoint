import {Document} from 'mongoose';

export interface Transaction extends Document {
    readonly traveller: any;
    readonly merchant: any;
    readonly amount: number;
    readonly item_name: string;
    readonly item_code: string;
    readonly status: string;
    readonly transaction_reference: string;
    readonly payment_reference: string;
}