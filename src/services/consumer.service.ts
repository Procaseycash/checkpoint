import {Component, Inject} from '@nestjs/common';
import {Consumer} from '../models/consumer';
import {deepCopy, getNextSequenceValue, getOffsetAndCateria, getPaginated} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {modelCounter} from '../config/constants.conf';
import {CheckInLog} from '../models/check_in_log';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {UserService} from './user.service';
import {UserEnum} from '../enums/user.enum';

@Component()
export class ConsumerService {
    constructor(@Inject('ConsumerRepo') private readonly consumerRepo: Model<Consumer>,
                private readonly userService: UserService,
                @Inject('CheckInLogRepo') private readonly checkInLogRepo: Model<CheckInLog>,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    public async create(consumer) {
        consumer.type = UserEnum.CONSUMER;
        return await this.userService.create(this.consumerRepo, consumer);
    }

    public async update(consumer) {
        await this.userService.update(this.consumerRepo, consumer);
        return await this.getConsumerById(consumer.id);
    }

    public async remove(id) {
        return await this.userService.remove(this.consumerRepo, id);
    }

    async getConsumerById(id: number) {
        return await this.userService.getUserById(this.consumerRepo, id);
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.consumerRepo.find().sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.consumerRepo, info);
    }

    public async getConsumerCheckInHistory() {
        const consumer = ReqInstance.req.user;
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.checkInLogRepo.find({consumer: consumer.id}).populate('consumer').sort({_id: -1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.checkInLogRepo, info);
    }

    public async logCheckInQuery(result) {
        result.consumer = ReqInstance.req.user ? ReqInstance.req.user.id : null;
        result._id = await getNextSequenceValue(this.counterRepo, modelCounter.checkInLog);
        const data = await this.checkInLogRepo.create(result);
        console.log('logQuery', deepCopy(data));
        return data;
    }

    public async getCheckInHistory() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.checkInLogRepo.find().populate('consumer').sort({_id: -1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.checkInLogRepo, info);
    }
}
