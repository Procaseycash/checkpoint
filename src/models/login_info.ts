import { Document } from 'mongoose';

export interface LoginInfo extends Document {
    readonly user: any;
    readonly status: string;
    readonly ip_address: string;
    readonly ref_token: string;
    readonly browser_agent: string;
    readonly last_login: Date;
}