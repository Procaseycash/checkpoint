import {EmailSettings} from '../config/mail.conf';
import {ENV} from '../env';
import {sendMail} from './utils';

/**
 * This is used to send application error log
 * @param status
 * @param message
 * @param type
 * @returns {Promise<void>}
 */
export const mailAppError = async (status, message, type) => {
    const data = {type, status, message};
    data['to'] = (ENV.current() === 'production') ? EmailSettings.prod.errorMails : (ENV.current() === 'test')
        ? EmailSettings.test.errorMails : EmailSettings.dev.errorMails;
    data['to'] = data['to'].toString();
    const date = new Date();
    data['date_time'] = (date.toDateString() + ', ' + date.toTimeString());
    const template = {
        name: 'error_log',
        ...{data},
    };
    const params = {
        text: ` Hello Team,
                        Please be informed that there was an error on CheckPoint Loan System at ${data['date_time']}.
                        Find below details, Status: ${status}, Type: ${type}, Message: ${message}. Thank you`,
        to: data['to'],
        subject: 'Application Error Notification',
    };
    sendMail(params, template);
};
