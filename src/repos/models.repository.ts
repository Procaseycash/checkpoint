import UserSchema from '../schemas/user';
import LoginInfoSchema from '../schemas/login_info';
import {Connection} from 'mongoose';
import CounterSchema from '../schemas/counters';
import CheckInLogSchema from '../schemas/check_in_log';
import ConsumerSchema from '../schemas/consumer';
import MerchantSchema from '../schemas/merchant';
import WalletSchema from '../schemas/wallet';
import TransactionSchema from '../schemas/transaction';

export const userRepo = [
    {
        provide: 'UserRepo',
        useFactory: (connection: Connection) => connection.model('User', UserSchema),
        inject: ['DbConnectionToken'],
    },
];

export const consumerRepo = [
    {
        provide: 'ConsumerRepo',
        useFactory: (connection: Connection) => connection.model('Consumer', ConsumerSchema),
        inject: ['DbConnectionToken'],
    },
];

export const walletRepo = [
    {
        provide: 'WalletRepo',
        useFactory: (connection: Connection) => connection.model('Wallet', WalletSchema),
        inject: ['DbConnectionToken'],
    },
];

export const transactionRepo = [
    {
        provide: 'TransactionRepo',
        useFactory: (connection: Connection) => connection.model('Transaction', TransactionSchema),
        inject: ['DbConnectionToken'],
    },
];

export const merchantRepo = [
    {
        provide: 'MerchantRepo',
        useFactory: (connection: Connection) => connection.model('Merchant', MerchantSchema),
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

export const checkInLogRepo = [
    {
        provide: 'CheckInLogRepo',
        useFactory: (connection: Connection) => connection.model('CheckInLog', CheckInLogSchema),
        inject: ['DbConnectionToken'],
    },
];
