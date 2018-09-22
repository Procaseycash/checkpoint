import {BadRequestException, NotFoundException} from '@nestjs/common';
import * as passwordHash from 'password-hash';
import * as _ from 'lodash';
import {messages} from '../config/messages.conf';
import {constants} from '../config/constants.conf';
import {ENV} from '../env';
import {Mail} from './mail';
import * as path from 'path';
import * as fs from 'fs';
import * as faker from 'faker';
import * as mustache from 'mustache';
import {EmailSettings} from '../config/mail.conf';
import {WEB_URL} from '../config/app.config';
import {ENCRYPTION} from "./encryption";

const mailFilePath = path.resolve(__dirname, '../public/views/mails');

/**
 * This is used to hash, verify and check status of password
 * @type {{hash: ((data) => any | Observable<any>); verify: ((inputPassword, hashPassword) => any); isHashed: ((input) => any)}}
 */
export const password = {
    hash: (data) => {
        return passwordHash.generate(data);
    },
    verify: (inputPassword, hashPassword) => {
        return passwordHash.verify(inputPassword, hashPassword);
    },
    isHashed: (input) => {
        return passwordHash.isHashed(input);
    },
};

/**
 * This is used to reformat object by reconstructing it through deep copy
 * @param data
 * @returns {any}
 */
export const deepCopy = (data) => {
    console.log('data :: ', data)
    return JSON.parse(JSON.stringify(data));
};

/**
 * This is used to format errors catched
 * @type {{formatError: ((errors) => (any | Array))}}
 */
export const catchErrors = {
    formatError: (errors) => {
        if (!(errors && errors.fields)) {
            return errors.message;
        }
        let i = 0, obj = {};
        const errs = [];
        console.log('he=', deepCopy(errors).parent);
        Object.entries(errors.fields).forEach(([key, value]) => {
            const message = (errors.errors) ? errors.errors[i]['message'] : messages.notFound;
            obj[key] = (message && message.indexOf('_id') > -1 && message.indexOf('unique')) ? messages.alreadyExist : message;
            errs.push(obj);
            obj = {};
            i++;
        });
        return errs;
    },
};

/**
 * This is used to add slug to an item for save request
 */
export const addSlug = (items, key) => {
    items.forEach((item, i) => {
        items[i]['slug'] = generateSlug(item[key]);
    });
    return items;
};

export const getOffsetAndCateria = (req) => {
    const nPerPage = (req.query && req.query.limit) ? +req.query.limit : constants.paginationLimit;
    const page = ((req.query && req.query.page && +req.query.page > 0) ? +req.query.page - 1 : 0);
    const offset = nPerPage * page;
    return {offset, page, nPerPage};
};

export const getPaginated = async (list, repo, info) => {
    console.log("result=", list);
    const total_page = await repo.countDocuments();
    const current_page = info.page + 1;
    const pages = Math.ceil(total_page / info.nPerPage);
    const next_page = current_page < pages ? current_page + 1 : current_page === pages ? null : total_page;
    const previous_page = current_page === 1 ? null : current_page - 1;
    return {
        list,
        total_page,
        per_page: info.nPerPage,
        current_page,
        next_page,
        previous_page,
        last_page: pages,
    };
};

/**
 * This is used to validate email
 * @param email
 * @returns {boolean}
 */
export const isValidMail = (email) => {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&*+=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return !(email !== '' && (email.length <= 5 || !EMAIL_REGEXP.test(email)));
};


/**
 * This is used to validate password
 * @param pwd
 * @returns {boolean}
 */
export const isValidPassword = (pwd) => {
    const PWD_REGEXP = /^(?=.*\d)(?=.*[!@#$%^&*~`()"¬}{:;.<>|?/\\=+_\-,£])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return !(pwd !== '' && (pwd.length <= 7 || !PWD_REGEXP.test(pwd)));
};


/**
 * This is used to update an array of object key with default value
 * @param arrayOfData
 * @param prop
 * @param value
 * @returns {any}
 */
export const updateByDefaultValue = (arrayOfData, prop, value?: any) => {
    if (_.isObject(prop) && Object.keys(prop).length === 0 && !value) {
        return arrayOfData;
    }
    arrayOfData.forEach((data, i) => {
        if (_.isObject(prop)) {
            _.forEach(prop, (val, key) => {
                if (_.isArray(val)) {
                    arrayOfData[i][key] = val[i];
                } else {
                    arrayOfData[i][key] = val;
                }
            });
        } else {
            arrayOfData[i][prop] = value;
        }
    });
    return arrayOfData;
};

/**
 * This shows occurence of a value in an array/ array<object>
 * @param data
 * @param {any} key
 * @param pivot
 */
export const occurrence = (data, key = null, pivot) => {
    console.log('dataDefu=', data);
    const result = (data.filter((val) => (key) ? (val[key] === pivot) : (val === pivot)));
    return result.length;
};

/**
 * This is used to get Enum Values
 * @param anEnum
 */
export const getEnums = (anEnum) => {
    return _.map(anEnum, (value) => value);
};

/**
 * This is used to generate slug
 * @param name
 */
export const generateSlug = (name) => {
    return name.split(' ').join('_').toLowerCase();
};


/**
 * This is used to convert csv file to json object for create.
 * @param files
 * @param {string[]} keys
 * @param {boolean} withHeaders
 * @returns {Array}
 */
export const csvToJson = (files, keys?: string[], withHeaders?: boolean) => {
    if (!files) {
        throw new BadRequestException(messages.failed);
    }
    const arrayJsonData = [];
    let jsonData = {};
    const data = files.data.toString().split('"').join('').split('\r');
    if (withHeaders) {
        keys = data[0].replace('\n', '').split(',');
        data.shift();
    }
    console.log('data=', data);
    data.forEach((value, i) => {
        value = value.replace('\n', '').split(',');
        jsonData = {};
        value.forEach((res, j) => {
            jsonData[keys[j]] = res || null;
        });
        arrayJsonData.push(jsonData);
    });
    console.log('arrayData=', arrayJsonData);
    return arrayJsonData;
};

/**
 * This is used to process email to be sent out
 * @returns {Promise<void>}
 * @param params
 * @param template
 * @param cb
 */
export const sendMail = async (params: { text: string, to: string, subject: string, [name: string]: any },
                               template: { name: string, data: object }, cb?: any) => {
    try {
        template.data['site'] = (ENV.current() === 'production') ? WEB_URL.prod.site : (ENV.current() === 'test') ? WEB_URL.test.site : WEB_URL.dev.site;
        const appTemplate = fs.readFileSync(mailFilePath + '/' + `${template.name}.html`).toString();
        mustache.parse(appTemplate);
        const output = (mustache.render(appTemplate, template.data));
        params['from'] = (ENV.current() === 'production') ? EmailSettings.prod.mailer.from : (ENV.current() === 'test')
            ? EmailSettings.test.mailer.from : EmailSettings.dev.mailer.from;
        params['html'] = output;
        // console.log({params});
        Mail.send(params, async (mailRes: boolean) => {
            console.log({mailRes});
            if (cb && cb.constructor === Function) {
                cb(mailRes);
            }
            return mailRes;
        });
    } catch (e) {
        if (cb && cb.constructor === Function) {
            cb(e.message);
        }
    }
};

export const getNextSequenceValue = async (repo, sequenceName) => {
    const findExist = await repo.findOne({_id: sequenceName}).exec();
    console.log({findExist});
    if (!findExist) {
        await repo.create({_id: sequenceName, seq: 0});
    }
    const sequenceDocument = await repo.findOneAndUpdate(
        {_id: sequenceName},
        {$inc: {['seq']: 1}},
        {returnNewDocument: true, new: true}).exec();
    console.log({sequenceDocument});
    return sequenceDocument.seq;
};

export const generateKey = () => {
    return ENCRYPTION.encode(faker.random.uuid + new Date().getTime()).substring(0, 20);
};

