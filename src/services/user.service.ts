import {BadRequestException, Component, forwardRef, Inject} from '@nestjs/common';
import {User} from '../models/user';
import {
    deepCopy, getNextSequenceValue, getOffsetAndCateria, getPaginated, isValidPassword,
    password,
} from '../utils/utils';
import {UserEnum} from '../enums/user.enum';
import {messages} from '../config/messages.conf';
import {ServicesService} from './services.service';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {modelCounter} from '../config/constants.conf';
import {CheckInLog} from '../models/check_in_log';
import {UserNotFoundException} from '../shared/filters/throwable.not.found';
import {ReqInstance} from '../shared/interceptors/req.instance';

@Component()
export class UserService {
    constructor(@Inject('UserRepo') private readonly userRepo: Model<User>,
                @Inject(forwardRef(() => ServicesService))
                private readonly servicesService: ServicesService,
                @Inject('CheckInLogRepo') private readonly checkInLogRepo: Model<CheckInLog>,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    public async create(repo: any, user: any) {
        const existEmail = await repo.findOne({email: user.email});
        if (existEmail) throw new BadRequestException(messages.emailExist);
        if (!isValidPassword(user.password)) {
            throw new BadRequestException(messages.invalidPwd);
        }
        const userPermission = ReqInstance.req['user'];
        user.email = user.email.toLowerCase();
        user['_id'] = await getNextSequenceValue(this.counterRepo, modelCounter[user.type.toLowerCase()]);
        const userCopy = deepCopy(user);
        user.password = password.hash(user.password);
        const data = await repo.create(userCopy); // account creation using its repo
        const userLogin = await this.userRepo.create({
            _id: await getNextSequenceValue(this.counterRepo, modelCounter.user),
            user: user._id,
            email: user.email,
            password: user.password,
            type: user.type,
        });
        if (!(userLogin && data)) throw new BadRequestException(messages.failedCreation);
        return await ((userPermission && userPermission.type === UserEnum.SYSADMIN) ? this.getUserById(repo, user.id) : this.servicesService.authenticate(userCopy));
    }

    public async update(repo, user) {
        if (ReqInstance.req.user.id !== user.id) throw new UserNotFoundException();
        if (user['password']) user['password'] = undefined;
        if (user['email']) user['email'] = undefined;
        if (user['type']) user['type'] = undefined;
        user = deepCopy(user);
        const data = await repo.update({_id: user.id}, {$set: user});
        if (!data['nModified']) throw new BadRequestException(messages.unable);
        return await this.getUserById(repo, user.id);
    }

    public async remove(repo, id) {
        const user = ReqInstance.req.user;
        if (user && user['type'] !== UserEnum.SYSADMIN) throw new BadRequestException(messages.notAllowedToDelete);
        const data = await repo.delete({_id: id});
        if (!data || !data['nModified']) throw new BadRequestException(messages.failedToDelete);
        return true;
    }

    async getUserById(repo, id: number) {
        return await repo.findOne({_id: id});
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.userRepo.find().sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.userRepo, info);
    }
}
