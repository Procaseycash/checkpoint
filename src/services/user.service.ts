import {BadRequestException, Component, forwardRef, Inject} from '@nestjs/common';
import {User} from '../models/user';
import {
    catchErrors, deepCopy, getNextSequenceValue, getOffsetAndCateria, getPaginated, isValidPassword,
    password,
} from '../utils/utils';
import {jwt} from '../utils/jwt';
import {UserEnum} from '../enums/user.enum';
import {messages} from '../config/messages.conf';
import * as faker from 'faker';
import {ServicesService} from './services.service';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {modelCounter} from '../config/constants.conf';
import {SearchHistory} from '../models/search_history';
import {UserNotFoundException} from '../shared/filters/throwable.not.found';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {sessionTimeoutPeriod} from "../config/app.config";

@Component()
export class UserService {
    constructor(@Inject('UserRepo') private readonly userRepo: Model<User>,
                @Inject(forwardRef(() => ServicesService))
                private readonly servicesService: ServicesService,
                @Inject('SearchHistoryRepo') private readonly searchHistoryRepo: Model<SearchHistory>,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    private async processToken(data) {
        data = deepCopy(data);
        data['ref_token'] = faker.random.uuid();
        data['session_timeout'] = await sessionTimeoutPeriod();
        const token = jwt.sign(data);
        await this.servicesService.logActiveUser(ReqInstance.req, data, token);
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

    public async create(user) {
        const existEmail = await this.userRepo.findOne({email: user.email});
        if (existEmail) throw new BadRequestException(messages.emailExist);
        if (!isValidPassword(user.password)) {
            throw new BadRequestException(messages.invalidPwd);
        }
        const userPermission = ReqInstance.req['user'];
        user.email = user.email.toLowerCase();
        user['_id'] = await getNextSequenceValue(this.counterRepo, modelCounter.user);
        const userCopy = deepCopy(user);
        user.password = password.hash(user.password);
        const data = await this.userRepo.create(user);
        console.log('USER', deepCopy(data));
        return await ((userPermission && userPermission.type === UserEnum.SYSADMIN) ? this.getUserById(user.id) : this.authenticate(userCopy));
    }

    public async update(user) {
        if (ReqInstance.req.user.id !== user.id) throw new UserNotFoundException();
        if (user['password']) user['password'] = undefined;
        if (user['email']) user['email'] = undefined;
        user = deepCopy(user);
        const data = await this.userRepo.update({_id: user.id}, {$set: user});
        if (!data['nModified']) {
            throw new BadRequestException(messages.unable);
        }
        return await this.getUserById(user.id);
    }

    public async remove(id) {
        const user = ReqInstance.req.user;
        if (user && user['type'] !== UserEnum.SYSADMIN) throw new BadRequestException(messages.notAllowedToDelete);
        const data = await this.userRepo.delete({_id: id});
        if (!data || !data['nModified']) throw new BadRequestException(messages.failedToDelete);
        return true;
    }

    async getUserById(id: number) {
        return await this.userRepo.findOne({_id: id});
    }

    async getToken(id: number) {
        const data = await this.getUserById(id);
        return await this.processToken(data);
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.userRepo.find().sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.userRepo, info);
    }

    public async getUserCheckInHistory() {
        const user = ReqInstance.req.user;
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.searchHistoryRepo.find({user: user.id}).populate('user').sort({_id: -1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.searchHistoryRepo, info);
    }

    public async logCheckInQuery(result) {
        const user = ReqInstance.req.user || {id: null};
        const _id = await getNextSequenceValue(this.counterRepo, modelCounter.searchHistory);
        const data = await this.searchHistoryRepo.create({_id, result, user: user.id});
        console.log('logQuery', deepCopy(data));
        return true;
    }

    public async getCheckInHistory() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.searchHistoryRepo.find().populate('user').sort({_id: -1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.searchHistoryRepo, info);
    }
}
