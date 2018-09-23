import {BadRequestException, Component, Inject} from '@nestjs/common';
import {Traveller} from '../models/traveller';
import {deepCopy, getNextSequenceValue, getOffsetAndCateria, getPaginated} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {
    CURRENCY,
    DEFAULT_KILOMETER, DEFAULT_PERCENTAGE, modelCounter, POINT_RATIO,
    POINT_VALUE
} from '../config/constants.conf';
import {CheckInLog} from '../models/check_in_log';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {UserService} from './user.service';
import {UserEnum} from '../enums/user.enum';
import {TripInitReq} from "../requests/trip.init.req";
import {DistanceManager} from "../utils/distance.manager";
import {TripEndReq} from "../requests/trip.end.req";
import {TripEnum} from "../enums/TripEnum";
import {CurrentLocationNotFound, LocationNotFound, UnknownTrip} from "../shared/filters/throwable.not.found";
import {WalletService} from "./wallet.service";
import {messages} from "../config/messages.conf";

@Component()
export class TravellerService {
    constructor(@Inject('TravellerRepo') private readonly travellerRepo: Model<Traveller>,
                private readonly userService: UserService,
                private readonly walletService: WalletService,
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

    public async initTrip(data: TripInitReq) {
        const tripInfo = await DistanceManager.calculate(data.user_origin_location, data.user_destination_location);
        if (!tripInfo) throw new LocationNotFound();
        Object.assign(data, tripInfo);
        data['status'] = TripEnum.ONGOING;
        const result = await this.logCheckInQuery(data); // log query here
        return await this.findTripById(result._id);
    }

    public async findTripById(id: number) {
        return await this.checkInLogRepo.findOne({_id: id}).populate('traveller').exec();
    }

    public async findCurrentTrip() {
        return (await this.checkInLogRepo.find({traveller: ReqInstance.req.user.id}).populate('traveller')
            .sort({_id: -1}).limit(1).exec())[0];
}

    public async findCurrentTripWithNoPopulate() {
        return (await this.checkInLogRepo.find({traveller: ReqInstance.req.user.id}).sort({_id: -1}).limit(1).exec())[0];
    }

    public async updateTrip(payload) {
        const data = await this.checkInLogRepo.updateOne({_id: payload.id}, {$set: payload});
        if (!data['nModified']) throw new BadRequestException(messages.unable);
        return await this.findCurrentTrip();
    }

    public async endTrip(data: TripEndReq) {
        let currentCheckIn = await this.findCurrentTripWithNoPopulate();
        if (!currentCheckIn) throw new UnknownTrip();
        currentCheckIn = deepCopy(currentCheckIn);
        console.log({currentCheckIn});
        const destination = data.destination_latitude + ',' + data.destination_longitude;
        let endedDestination: any = await DistanceManager.calculate(currentCheckIn.gps_origin_location, destination);
        if (!endedDestination) endedDestination = {kilometer: '0 km', total_time: '0 min'}; // a tradeoff when error occured while calculating auto-location KM.
        currentCheckIn.gps_destination_location = destination;
        currentCheckIn.currency = CURRENCY;
        currentCheckIn.kilometer = parseFloat(currentCheckIn.kilometer);
        endedDestination.kilometer = parseFloat(endedDestination.kilometer);
        const diffInKm = currentCheckIn.kilometer - endedDestination.kilometer;
        console.log({kilo: [currentCheckIn.kilometer, endedDestination.kilometer, diffInKm]});
        currentCheckIn.kilometer = diffInKm > 10 ? currentCheckIn.kilometer - diffInKm + 10 : currentCheckIn.kilometer;
        const percentageIncrease = (currentCheckIn.kilometer * DEFAULT_PERCENTAGE) / DEFAULT_KILOMETER;
        const increasePointValue = POINT_VALUE + (percentageIncrease / 100);
        currentCheckIn.point = POINT_VALUE + increasePointValue; // point is given
        currentCheckIn.amount = currentCheckIn.point / POINT_RATIO; // cash is given
        currentCheckIn.status = TripEnum.COMPLETED;
        const verifyCheckInEnded = await this.findCurrentTripWithNoPopulate();
        if (verifyCheckInEnded.status !== TripEnum.COMPLETED)
            await this.walletService.topUserWallet({amount: currentCheckIn.amount, id: ReqInstance.req.user.id});
        return await this.updateTrip(currentCheckIn);
    }
}
