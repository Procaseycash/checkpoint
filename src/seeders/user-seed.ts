import * as faker from 'faker';
import {password} from '../utils/utils';
import {SEED_LENGTH} from '../config/app.config';
import {UserEnum} from '../enums/user.enum';

const USERS = [];

for (let i = 0; i < 5; i++) {
    const user = {
        _id: i + 1,
        password: password.hash('password'),
        email: faker.internet.email().toLowerCase(),
        type: UserEnum.TRAVELLER,
    };
    USERS.push(user);
}

for (let i = 0; i < 5; i++) {
    const user = {
        _id: i + 1,
        password: password.hash('password'),
        email: faker.internet.email().toLowerCase(),
        type: UserEnum.MERCHANT,
    };
    USERS.push(user);
}

USERS.push({
    _id: SEED_LENGTH + 2,
    password: password.hash('password'),
    email: 'admin@checkin.com',
    type: UserEnum.SYSADMIN,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
});
USERS.push({
    _id: SEED_LENGTH + 3,
    password: password.hash('password'),
    email: 'kezyolanipekun@gmail.com',
    type: UserEnum.SYSADMIN,
});

export default USERS;