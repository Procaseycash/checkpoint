import {ENV} from '../env';
import {HttpStatus} from '@nestjs/common';

export const APP_ENV = ENV.current();
export const PORT = (APP_ENV === 'production') ? 6003 : (APP_ENV === 'test') ? 6002 : 6001;
// console.log('Port=', PORT);
export const JWT_KEY = 'e92cdb34-dc0d-4873-99fc-e30dbac4e6d2-136f66f4-55e6-4d2e-adfa-0bd6c98081e1';

export const SEED_LENGTH = 10;
export const API_VERSION = 'v1';
export const DIRECTION_MATRIX_API_KEY = 'AIzaSyBTEaZ7_AkCEIFX2tQOKa1EWhBOb-aSRU4';
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