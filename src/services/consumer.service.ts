import {Component, Inject} from '@nestjs/common';
import {Traveller} from '../models/traveller';
import {deepCopy, getNextSequenceValue, getOffsetAndCateria, getPaginated} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {modelCounter} from '../config/constants.conf';
import {CheckInLog} from '../models/check_in_log';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {UserService} from './user.service';
import {UserEnum} from '../enums/user.enum';

@Component()
export class TravellerService {
    constructor(@Inject('TravellerRepo') private readonly travellerRepo: Model<Traveller>,
                private readonly userService: UserService,
                @Inject('CheckInLogRepo') private readonly checkInLogRepo: Model<CheckInLog>,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    public async create(traveller) {
        traveller.type = UserEnum.TRAVELLER;
        return await this.userService.create(this.travellerRepo, traveller);
    }

    public async update(traveller) {
        await this.userService.update(this.travellerRepo, traveller);
        return await this.getTravellerById(traveller.id);
    }

    public async remove(id) {
        return await this.userService.remove(this.travellerRepo, id);
    }

    async getTravellerById(id: number) {
        return await this.userService.getUserById(this.travellerRepo, id);
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.travellerRepo.find().sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.travellerRepo, info);
    }

    public async getTravellerCheckInHistory() {
        const traveller = ReqInstance.req.user;
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.checkInLogRepo.find({traveller: traveller.id}).populate('traveller').sort({_id: -1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.checkInLogRepo, info);
    }

    public async logCheckInQuery(result) {
        result.traveller = ReqInstance.req.user ? ReqInstance.req.user.id : null;
        result._id = await getNextSequenceValue(this.counterRepo, modelCounter.checkInLog);
        const data = await this.checkInLogRepo.create(result);
        console.log('logQuery', deepCopy(data));
        return data;
    }

    public async getCheckInHistory() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.checkInLogRepo.find().populate('traveller').sort({_id: -1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.checkInLogRepo, info);
    }
}
