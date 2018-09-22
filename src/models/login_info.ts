import { Document } from 'mongoose';

export interface LoginInfo extends Document {
    readonly user: number;
    readonly type: string;
    readonly status: string;
    readonly ip_address: string;
    readonly ref_token: string;
    readonly browser_agent: string;
    readonly last_login: Date;
}