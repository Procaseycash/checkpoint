import {databaseRepository} from '../repos/db.repository';
import * as mongoose from 'mongoose';
import UserSchema from '../schemas/user';
import CounterSchema from '../schemas/counters';
import USERS from './user-seed';
import {modelCounter} from '../config/constants.conf';
import LoginInfoSchema from '../schemas/login_info';

const connect = async () => await databaseRepository[0].useFactory();
let User = null, LoginInfo = null, Counter = null;

async function models() {
    await connect();
    User = mongoose.model('User', UserSchema);
    Counter = mongoose.model('Counter', CounterSchema);
    LoginInfo = mongoose.model('LoginInfo', LoginInfoSchema);
}

async function runSeeders() {
    await models();
    await User.create(USERS);
    await Counter.create({_id: modelCounter.user, seq: USERS.length});

    console.log('Seeding successful, Thank you...');
}

async function undoCollections() {
    await models();
    await User.remove();
    await Counter.remove();
    await LoginInfo.remove();
    console.log('Seeders Undo successfully, Thank you...');
}

if (process.argv.toLocaleString().indexOf('--seed') > -1) {
    console.log('Running Seeders, please wait...');
    runSeeders();
} else if (process.argv.toLocaleString().indexOf('--undo') > -1) {
    console.log('Undo Seeding, please wait...');
    undoCollections();
}