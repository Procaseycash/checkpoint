import {BadRequestException, Component, forwardRef, Inject} from '@nestjs/common';
import {Wallet} from '../models/wallet';
import {deepCopy, generateKey, getNextSequenceValue, getOffsetAndCateria, getPaginated} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {messages} from '../config/messages.conf';
import {CURRENCY, modelCounter, POINT_RATIO} from '../config/constants.conf';
import {MerchantService} from './merchant.service';

@Component()
export class WalletService {
    constructor(@Inject('WalletRepo') private readonly walletRepo: Model<Wallet>,
                @Inject(forwardRef(() => MerchantService)) private readonly merchantService: MerchantService,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    public async create(amount: { amount: number }) {
        const userWalletExist = await this.getWalletByTravellerId(ReqInstance.req.user.id);
        if (userWalletExist) throw new BadRequestException(messages.walletAlreadyExist);
        const wallet_no = generateKey();
        const wallet = {
            _id: await getNextSequenceValue(this.counterRepo, modelCounter.wallet),
            ...amount,
            point: amount.amount,
            traveller: ReqInstance.req.user.id,
            currency: CURRENCY,
            wallet_no,
        };
        const data = await this.walletRepo.create(wallet);
        if (!data) throw new BadRequestException(messages.failedCreation);
        return await this.getWalletById(wallet._id);
    }

    public async update(wallet: { amount: number, id: number }) {
        const data = await this.walletRepo.updateOne({_id: wallet.id}, {$set: {amount: wallet.amount, point: wallet.amount}});
        if (!data['nModified']) throw new BadRequestException(messages.unable);
        return await this.getWalletById(wallet.id);
    }

    public async remove(id: number) {
        const data = await this.walletRepo.delete({_id: id});
        if (!data || !data['nModified']) throw new BadRequestException(messages.failedToDelete);
        return true;
    }

    async getWalletById(id: number) {
        return await this.walletRepo.findOne({_id: id}).populate('traveller').exec();
    }

    async getWalletByTravellerId(id: number) {
        return await this.walletRepo.findOne({traveller: id}).populate('traveller').exec();
    }

    async getByWalletNo(wallet_no) {
        return await this.walletRepo.findOne({wallet_no}).populate('traveller').exec();
    }

    async topUserWallet(payload: {amount: number, id: number}) {
        console.log({payload});
        const wallet = await this.walletRepo.findOne({traveller: payload.id});
        if (!wallet) return await this.create({amount: payload.amount});
        payload.amount +=  wallet.amount;
        payload.amount = parseFloat(payload.amount.toFixed(2));
        payload.id = wallet._id;
        return await this.update(payload);
    }

    async getByWalletNoUsingMerchantSecret(secret, wallet_no) {
        await this.merchantService.decryptMerchantSecret({secret}); // validate and decode merchant secret
        return await this.walletRepo.findOne({wallet_no}).populate('traveller').exec();
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.walletRepo.find().populate('traveller').sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.walletRepo, info);
    }
}
