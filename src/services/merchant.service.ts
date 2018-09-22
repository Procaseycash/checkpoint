import {Component, Inject} from '@nestjs/common';
import {Merchant} from '../models/merchant';
import {generateKey, getOffsetAndCateria, getPaginated, password} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {CheckInLog} from '../models/check_in_log';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {UserService} from './user.service';
import {UserEnum} from '../enums/user.enum';


@Component()
export class MerchantService {
    constructor(@Inject('MerchantRepo') private readonly merchantRepo: Model<Merchant>,
                private readonly userService: UserService,
                @Inject('CheckInLogRepo') private readonly checkInLogRepo: Model<CheckInLog>,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    public async create(merchant) {
        merchant.type = UserEnum.MERCHANT;
        merchant.merchant_key = generateKey();
        return await this.userService.create(this.merchantRepo, merchant);
    }

    public async update(merchant) {
        if (merchant.merchant_key) merchant.merchant_key = undefined;
        await this.userService.update(this.merchantRepo, merchant);
        return await this.getMerchantById(merchant.id);
    }

    public async remove(id) {
        return await this.userService.remove(this.merchantRepo, id);
    }

    async getMerchantById(id: number) {
        return await this.userService.getUserById(this.merchantRepo, id);
    }

    async getMerchantByKey(key: string) {
        return await this.merchantRepo.findOne({merchant_key: key});
    }

    async validateMerchant(merchant: { email: string, password: string }): boolean {
        const data = await this.merchantRepo.findOne({email});
        return (data && data.email === merchant.email && password.verify(merchant.password, data.password));
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.merchantRepo.find().sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.merchantRepo, info);
    }
}
