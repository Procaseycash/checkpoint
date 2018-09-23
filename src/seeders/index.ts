import {databaseRepository} from '../repos/db.repository';
import * as mongoose from 'mongoose';
import UserSchema from '../schemas/user';
import CounterSchema from '../schemas/counters';
import USERS from './user-seed';
import {modelCounter} from '../config/constants.conf';
import LoginInfoSchema from '../schemas/login_info';
import MERCHANTS from "./merchant-seed";
import TRAVELLERS from "./traveller-seed";
import MerchantSchema from "../schemas/merchant";
import TravellerSchema from "../schemas/traveller";

const connect = async () => await databaseRepository[0].useFactory();
let User = null, LoginInfo = null, Counter = null, Merchant = null, Traveller = null;

async function models() {
    await connect();
    User = mongoose.model('User', UserSchema);
    Counter = mongoose.model('Counter', CounterSchema);
    LoginInfo = mongoose.model('LoginInfo', LoginInfoSchema);
    Merchant = mongoose.model('Merchant', MerchantSchema);
    Traveller = mongoose.model('Traveller', TravellerSchema);
}

async function runSeeders() {
    await models();
    await Merchant.create(MERCHANTS);
    await Traveller.create(TRAVELLERS);
    await User.create(USERS);
    await Counter.create({_id: modelCounter.user, seq: USERS.length + 5});
    await Counter.create({_id: modelCounter.traveller, seq: TRAVELLERS.length});
    await Counter.create({_id: modelCounter.merchant, seq: MERCHANTS.length});
    console.log('Seeding successful, Thank you...');
}

async function undoCollections() {
    await models();
    await User.remove();
    await Traveller.remove();
    await Merchant.remove();
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