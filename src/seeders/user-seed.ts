import * as faker from 'faker';
import {password} from '../utils/utils';
import {SEED_LENGTH} from '../config/app.config';
import {UserEnum} from '../enums/user.enum';
import MERCHANTS from "./merchant-seed";
import TRAVELLERS from "./traveller-seed";

const USERS = [];
MERCHANTS.forEach((merchant) => {
    USERS.push({
        _id: i + 1,
        password: password.hash('Password@123'),
        email: merchant.email.toLowerCase(),
        type: UserEnum.MERCHANT,
    });
});
TRAVELLERS.forEach((traveller) => {
    USERS.push({
        _id: i + 1,
        password: password.hash('Password@123'),
        email: traveller.email,
        type: UserEnum.MERCHANT,
    });
});
USERS.push({
    _id: SEED_LENGTH + 2,
    password: password.hash('password'),
    email: 'admin@checkin.com',
    type: UserEnum.SYSADMIN,
});
USERS.push({
    _id: SEED_LENGTH + 3,
    password: password.hash('password'),
    email: 'kezyolanipekun@gmail.com',
    type: UserEnum.SYSADMIN,
});

export default USERS;