import * as faker from 'faker';
import {SEED_LENGTH} from "../config/app.config";

const TRAVELLER = [];
for (let i = 0; i < SEED_LENGTH; i++) {
    TRAVELLER.push({
        _id: i + 1,
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        phone_no: faker.phone.phoneNumber(),
        email: faker.internet.email().toLowerCase(),
    });
}
export default TRAVELLER;