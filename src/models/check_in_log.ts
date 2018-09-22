import { Document } from 'mongoose';

export interface CheckInLog extends Document {
    readonly consumer: any;
    readonly origin: string;
    readonly destination: string;
    readonly kilometer: string;
    readonly point: string;
    readonly amount: string;
    readonly status: string;
}