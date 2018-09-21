import {ENV} from '../env';
import {HttpStatus} from '@nestjs/common';
import {Session} from "../session/session";

export const APP_ENV = ENV.current();
export const PORT = (APP_ENV === 'production') ? 6001 : (APP_ENV === 'test') ? 6002 : 6000;
console.log('Port=', PORT);
export const JWT_KEY = 'e92cdb34-dc0d-4873-99fc-e30dbac4e6d2-136f66f4-55e6-4d2e-adfa-0bd6c98081e1';

export const SEED_LENGTH = 30;
export const API_VERSION = 'v1';
export const WEB_URL = {
    prod: {
        site: 'http://checkpoint.upltest.com',
    },
    dev: {
        site: 'http://checkpoint.upltest.com',
    },
    test: {
        site: 'http://checkpoint.upltest.com',
    },
};
export const APP_ERROR_CODES = [
    HttpStatus.OK, HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND,
    HttpStatus.UNAUTHORIZED, HttpStatus.NOT_ACCEPTABLE, HttpStatus.ACCEPTED,
    HttpStatus.CREATED, HttpStatus.FORBIDDEN,
];

export const sessionTimeoutPeriod = async () => {
    const data = await Session.redis.getAsync('SESSION_TIMEOUT_PERIOD');
    console.log('session=', data);
    if (!data) {
        await Session.redis.setAsync('SESSION_TIMEOUT_PERIOD', 5 * 60);
        return await Session.redis.getAsync('SESSION_TIMEOUT_PERIOD');
    }
    return data;
};