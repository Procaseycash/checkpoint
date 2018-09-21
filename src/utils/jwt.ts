import * as jsonwebtoken from 'jsonwebtoken';
import {JWT_KEY} from '../config/app.config';
import {NotAcceptableException} from '@nestjs/common';
import {messages} from '../config/messages.conf';

export const jwt = {
    sign: (data) => {
        return jsonwebtoken.sign(data, JWT_KEY);
    },
    decode: (authorization: string) => {
        if (!authorization) {
            throw new NotAcceptableException(messages.noAuthHeader);
        }
        const token = (authorization.indexOf(' ') > -1) ? authorization.split(' ')[1] : authorization;
        return jsonwebtoken.decode(token);
    },
    verify: (authorization: string) => {
        if (!authorization) {
            throw new NotAcceptableException(messages.noAuthHeader);
        }
        const token = (authorization.indexOf(' ') > -1) ? authorization.split(' ')[1] : authorization;
        return jsonwebtoken.verify(token, JWT_KEY);
    },
};
