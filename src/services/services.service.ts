import {Component} from '@nestjs/common';
import {
    catchErrors,
    deepCopy,
    getEnums, getNextSequenceValue, password,
    sendMail,
} from '../utils/utils';
import {MailEnum} from '../enums/mail.enum';
import {UserEnum} from '../enums/user.enum';
import {ENV} from '../env';
import {EmailSettings} from '../config/mail.conf';
import * as faker from 'faker';
import {UserNotFoundException} from '../shared/filters/throwable.not.found';
import {BadRequestException, forwardRef, Inject} from '@nestjs/common';
import {messages} from '../config/messages.conf';
import {User} from '../models/user';
import {LogoutEnum} from '../enums/logout.enum';
import {LoginInfo} from '../models/login_info';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {modelCounter} from '../config/constants.conf';
import {isWebUri} from 'valid-url';
import {UserService} from './user.service';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {jwt} from '../utils/jwt';
import {Merchant} from '../models/merchant';
import {Consumer} from '../models/consumer';
import {Session} from "../session/session";
import {TransactionEnum} from "../enums/transaction.enum";
import {ErrorLogEnum} from "../enums/error.log.enum";

@Component()
export class ServicesService {
    constructor(@Inject('UserRepo') private readonly userRepo: Model<User>,
                @Inject('LoginInfoRepo') private readonly loginInfoRepo: Model<LoginInfo>,
                @Inject('MerchantRepo') private readonly merchantRepo: Model<Merchant>,
                @Inject('ConsumerRepo') private readonly consumerRepo: Model<Consumer>,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>,
                @Inject(forwardRef(() => UserService))
                private userService: UserService) {
    }

    getEnums() {
        return {
            mail: getEnums(MailEnum),
            user: getEnums(UserEnum),
            transaction: getEnums(TransactionEnum),
            error_log: getEnums(ErrorLogEnum),
            logout_by: getEnums(LogoutEnum),
        };
    }

    private async processToken(data) {
        data = deepCopy(data);
        data['ref_token'] = faker.random.uuid() + new Date().getTime();
        let userInfo = {};
        const repo: any = (data.type === UserEnum.CONSUMER) ? this.consumerRepo : (data.type === UserEnum.MERCHANT)
            ? this.merchantRepo : null;
        if (repo) userInfo = await repo.findOne({email: data.email});
        if (userInfo && repo) userInfo = deepCopy(userInfo);
        Object.assign(data, userInfo);
        const token = jwt.sign(data);
        await this.logActiveUser(ReqInstance.req, data, token);
        return token;
    }

    public async authenticate(user) {
        try {
            const data = await this.userRepo.findOne({email: user.email});
            if (!(data && data.email === user.email && password.verify(user.password, data.password))) return null;
            return await this.processToken(data);
        } catch (e) {
            throw new BadRequestException(catchErrors.formatError(e));
        }
    }

    async getToken(id: number) {
        const data = await this.userRepo.find(id).exec();
        await data.forEach(async (user, i) => {
            data[i]['token'] = await this.processToken(user);
        });
        return data;
    }

    async changePassword(passwordSettings) {
        if ((passwordSettings.new_password !== passwordSettings.confirm_password)) throw new BadRequestException(messages.passwordDoNotMatch);
        const user = ReqInstance.req.user;
        const dbUser = await this.userRepo.findOne({_id: user.id});
        if (!(password.verify(passwordSettings.old_password, dbUser.password))) throw new BadRequestException(messages.oldPasswordDoNotMatch);
        if (password.verify(passwordSettings.new_password, dbUser.password)) throw new BadRequestException(messages.previousPassDisallowed);
        const data = await this.userRepo.update({_id: user.id}, {$set: {password: password.hash(passwordSettings.new_password)}});
        if (!data['nModified']) throw new BadRequestException(messages.unable);
        return true;
    }

    async logout(status, ref_token) {
        Session.redis.del(`user:session:${ref_token}`);
        const data = await this.loginInfoRepo.update({ref_token}, {$set: {status}});
        if (!data['nModified'] && status !== LogoutEnum.SYSADMIN) throw new BadRequestException(messages.logoutFailed);
        return true;
    }

    async generateNewPassword(value, forgetPassword?: boolean) {
        let user: User = null;
        if (forgetPassword) {
            user = await this.userRepo.findOne({email: value});
            if (!user) throw new UserNotFoundException();
        } else throw new BadRequestException(messages.noFound);
        const pwd = 'CP@' + faker.random.uuid().substring(0, 8);
        user['password'] = pwd;
        const data = await this.userRepo.update({_id: user['id']}, {$set: {password: password.hash(pwd)}});
        if (!data['nModified']) throw new BadRequestException(messages.newPasswordGenFailed);
        this.sendNewPasswordByMail(user);
        return true;
    }

    async logActiveUser(req, data, token) {
        await Session.redis.setAsync(`user:session:${data.ref_token}`, token);
        const logger = await this.loginInfoRepo.create({
            _id: await getNextSequenceValue(this.counterRepo, modelCounter.loginInfo),
            user_id: data.id,
            type: data.type,
            ref_token: data.ref_token,
            browser_agent: req.browser_agent || data.browser_agent,
            ip_address: req.ip_address || data.ip_address,
        });
        if (!logger || !logger.id) throw new BadRequestException(messages.errorEncountered);
        return true;
    }

    private async sendNewPasswordByMail(data) {
        const template = {name: 'new_password', ...{data}};
        const to = (ENV.current() === 'production') ? data.email : (ENV.current() === 'test')
            ? EmailSettings.test.emails.toString() : EmailSettings.dev.emails.toString();
        const params = {
            text: ` Hello Customer,
                        Kindly use this new password generated below to log on to your account.
                        Password: ${data.password},
                        Please change this password from 'Profile' once you have accessed your CheckPoint Account. Thank you`,
            ...{to},
            subject: 'New Account Password',
        };
        sendMail(params, template);
    }

}
