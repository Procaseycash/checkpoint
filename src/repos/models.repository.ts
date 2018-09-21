import UserSchema from '../schemas/user';
import LoginInfoSchema from '../schemas/login_info';
import {Connection} from 'mongoose';
import CounterSchema from '../schemas/counters';
import SearchHistorySchema from '../schemas/search_history';

export const userRepo = [
    {
        provide: 'UserRepo',
        useFactory: (connection: Connection) => connection.model('User', UserSchema),
        inject: ['DbConnectionToken'],
    },
];

export const loginInfoRepo = [
    {
        provide: 'LoginInfoRepo',
        useFactory: (connection: Connection) => connection.model('LoginInfo', LoginInfoSchema),
        inject: ['DbConnectionToken'],
    },
];

export const counterRepo = [
    {
        provide: 'CounterRepo',
        useFactory: (connection: Connection) => connection.model('Counter', CounterSchema),
        inject: ['DbConnectionToken'],
    },
];

export const searchHistoryRepo = [
    {
        provide: 'SearchHistoryRepo',
        useFactory: (connection: Connection) => connection.model('SearchHistory', SearchHistorySchema),
        inject: ['DbConnectionToken'],
    },
];
