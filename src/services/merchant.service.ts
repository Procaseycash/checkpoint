import {Component, Inject, NotAcceptableException, UnauthorizedException} from '@nestjs/common';
import {Merchant} from '../models/merchant';
import {generateKey, getOffsetAndCateria, getPaginated, password} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {CheckInLog} from '../models/check_in_log';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {UserService} from './user.service';
import {UserEnum} from '../enums/user.enum';
import {ENCRYPTION} from '../utils/encryption';
import {User} from '../models/user';
import {messages} from "../config/messages.conf";


@Component()
export class MerchantService {
    constructor(@Inject('MerchantRepo') private readonly merchantRepo: Model<Merchant>,
                private readonly userService: UserService,
                @Inject('UserRepo') private readonly userRepo: Model<User>,
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

    async validateMerchant(merchant: { email: string, password: string }): Promise<boolean> {
        const data = await this.merchantRepo.findOne({email: merchant.email});
        return (data && data.email === merchant.email);
    }

    async generateMerchantSecret(merchant: { email: string, password: string }): Promise<string> {
        const data = await this.userRepo.findOne({email: merchant.email});
        if (!(data && data.email === merchant.email && password.verify(merchant.password, data.password))) throw new UnauthorizedException();
        const merchantData = await this.merchantRepo.findOne({email: merchant.email});
        if (merchantData.merchant_key !== ReqInstance.req.user.merchant_key) throw new NotAcceptableException(messages.invalidMerchantKey);
        return ENCRYPTION.encode(merchantData);
    }

    async decryptMerchantSecret(merchant: { secret: string }): Promise<Merchant> {
        const decodedSecret = ENCRYPTION.decode(merchant.secret);
        const merchantData = await this.merchantRepo.findOne({
            email: decodedSecret.email,
            merchant_key: decodedSecret.merchant_key,
        });
        if (!merchantData || merchantData.merchant_key !== ReqInstance.req.headers.merchant_key) throw new UnauthorizedException();
        return decodedSecret;
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.merchantRepo.find().sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.merchantRepo, info);
    }
}
