import {MailEnum} from '../enums/mail.enum';
import * as nodeMailer from 'nodemailer';
import * as mailGun from 'mailgun-js';
import {ENV, EnvEnum} from '../env';
import * as path from 'path';
import * as fs from 'fs';
import {EmailSettings} from '../config/mail.conf';

export class Mail {
    private static engine;
    private static transporter;
    private static mailSettings;
    public static filePath = path.resolve(__dirname, '../public/img/');

    /**
     * Setup mail engine
     * @param {MailEnum} defaultEngine
     */
    public static setEngine(defaultEngine: MailEnum) {
        Mail.engine = defaultEngine;
        Mail.config();
    }

    /**
     * This is used to get the current mail engine in used.
     * @returns {any}
     */
    public static getEngine() {
        return Mail.engine;
    }

    /**
     * Setup mail environment to use in sending out mails
     */
    public static config() {
        Mail.mailSettings = (ENV.current() === EnvEnum.PRODUCTION) ? EmailSettings.prod.mailer :
            (ENV.current() === EnvEnum.TEST) ? EmailSettings.test.mailer : EmailSettings.dev.mailer;
        switch (Mail.engine) {
            case MailEnum.MAILGUN:
                Mail.mailGunSetup();
                break;
            case MailEnum.SMTP:
                Mail.SmtpSetup();
                break;
            default:
                Mail.SmtpSetup();
                break;
        }
    }

    /**
     * This is used to setup mailgun for mailing using mailgun-js lib
     */
    private static mailGunSetup() {
        Mail.transporter = mailGun({apiKey: Mail.mailSettings.api_key, domain: Mail.mailSettings.domain});
    }

    /**
     * This is used to setup smtp for mailing using nodemailer lib
     */
    private static SmtpSetup() {
        Mail.transporter = nodeMailer.createTransport({
            host: Mail.mailSettings.host,
            port: Mail.mailSettings.host.port,
            pool: Mail.mailSettings.host.pool,
            secure: Mail.mailSettings.host.secure, // secure:true for port 465, secure:false for port 587
            auth: {
                user: Mail.mailSettings.host.username,
                pass: Mail.mailSettings.host.password,
            },
        });
    }

    /**
     * This is used to send mail depending on the engine in use.
     * @param params
     * @param cb
     */
    public static send(params: object, cb) {
        console.log('Mailing called');
        const keys = Object.keys(params);
        if (keys.indexOf('attachments') > -1) {
            params = Mail.constructAttachments(params);
        }
        switch (Mail.engine) {
            case MailEnum.MAILGUN:
                Mail.sendByMailGun(params, cb);
                break;
            case MailEnum.SMTP:
                Mail.sendBySmtp(params, cb);
                break;
            default:
                Mail.sendBySmtp(params, cb);
                break;
        }
    }

    /**
     * This is used to construct attachments based on the engine in use.
     * @param params
     * @returns {any}
     */
    private static constructAttachments(params) {
        switch (Mail.engine) {
            case MailEnum.MAILGUN:
                params['attachment'] = [];
                let data = null;
                params.attachments.forEach((filename, i) => {
                    data = fs.readFileSync(Mail.filePath + '/' + filename);
                    params['attachment'].push(new mailGun.Attachment({content: data, filename}));
                });
                break;
            case MailEnum.SMTP:
                params.attachments.forEach((filename, i) => {
                    data = fs.readFileSync(Mail.filePath + '/' + filename);
                    params['attachments'][i] = {content: data, filename};
                });
                break;
        }
        return params;
    }

    /**
     * This is used to process mailing using nodemailer
     * @param params
     * @param cb
     */
    private static sendBySmtp(params, cb) {
        Mail.transporter.sendMail(params, (error, info) => {
            if (error) {
                console.log('nodemailError=', error.message);
                cb(false);
                return false;
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            cb(true);
            return true;
        });
    }

    /**
     * This is used to process mailing using mailgun
     * @param params
     * @param cb
     */
    private static sendByMailGun(params, cb) {
        Mail.transporter.messages().send(params, (error, info) => {
            if (error) {
                console.log('mailGunError=', error.message);
                cb(false);
                return false;
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            cb(true);
            return true;
        });
    }

}