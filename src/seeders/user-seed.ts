import * as faker from 'faker';
import {password} from '../utils/utils';
import {SEED_LENGTH} from '../config/app.config';
import {UserEnum} from '../enums/user.enum';

const USERS = [];
for (let i = 0; i < 5; i++) {
    const userType = [UserEnum.CONSUMER, UserEnum.SYSADMIN];
    const rand = Math.floor(Math.random() * 2);
    const user = {
        _id: i + 1,
        password: password.hash('password'),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        phone_no: faker.phone.phoneNumber(),
        email: faker.internet.email().toLowerCase(),
        type: UserEnum.CONSUMER,
    };
    USERS.push(user);
}
USERS.unshift({
    _id: SEED_LENGTH + 2,
    password: password.hash('password'),
    first_name: 'Admin',
    last_name: 'Admin',
    phone_no: '09088998899',
    email: 'admin@checkin.com',
    type: UserEnum.SYSADMIN,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
});
USERS.unshift({
    _id: SEED_LENGTH + 3,
    password: password.hash('password'),
    first_name: 'Kazeem',
    last_name: 'Olanipekun',
    phone_no: '08135061846',
    email: 'kezyolanipekun@gmail.com',
    type: UserEnum.SYSADMIN,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
});

export default USERS;