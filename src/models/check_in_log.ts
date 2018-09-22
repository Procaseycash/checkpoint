import { Document } from 'mongoose';

export interface CheckInLog extends Document {
    readonly traveller: any;
    readonly user_origin_location: string;
    readonly gps_origin_location: string;
    readonly user_destination_location: string;
    readonly gps_destination_location: string;
    readonly kilometer: string;
    readonly point: string;
    readonly amount: string;
    readonly status: string;
}