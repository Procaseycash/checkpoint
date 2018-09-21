import {DB_CONFIG} from '../config/db.conf';
import * as mongoose from 'mongoose';

const auth = (DB_CONFIG.username && DB_CONFIG.password) ? `${DB_CONFIG.username}:${DB_CONFIG.password}@` : '';
const connectUrl = `mongodb://${auth}${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`;
console.log({connectUrl});
export const databaseRepository = [
    {
        provide: 'DbConnectionToken',
        useFactory: async (): Promise<typeof mongoose> =>
            await mongoose.connect(connectUrl, {useNewUrlParser: true}),
    },
];
