import * as faker from 'faker';
import {generateKey} from '../utils/utils';
import {SEED_LENGTH} from "../config/app.config";

const MERCHANTS = [];
for (let i = 0; i < SEED_LENGTH; i++) {
    MERCHANTS.push({
        _id: i + 1,
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        phone_no: faker.phone.phoneNumber(),
        account_no: faker.finance.account(),
        account_name: faker.finance.accountName(),
        bank_code: faker.company.catchPhrase(),
        bank_name: faker.company.companyName(),
        merchant_key: generateKey(),
        email: faker.internet.email().toLowerCase(),
    });
}
export default MERCHANTS;