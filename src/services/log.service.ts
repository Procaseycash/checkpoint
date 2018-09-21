import {Component} from '@nestjs/common';
import {catchErrors} from '../utils/utils';
import {inspect} from 'util';
import {ErrorLogEnum} from '../enums/error.log.enum';
import {mailAppError} from '../utils/mail.app.error';

@Component()
export class LogService {
    constructor() {}

    /**
     * This is used to log application error ranging from redis, mail, app error and unknown.
     * @param status
     * @param message
     * @param type
     * @returns {Promise<void>}
     */
    async logError(status, message, type) {
        try {
            message = (typeof message !== 'string') ? JSON.stringify(inspect(message)) : message;
            mailAppError(status, message, ErrorLogEnum.UNKNOWN);
        } catch (e) {
            message = catchErrors.formatError(e);
            message = (typeof message !== 'string') ? JSON.stringify(inspect(e)) : message;
            mailAppError('UNKNOWN', message, ErrorLogEnum.UNKNOWN);
        }

    }
}