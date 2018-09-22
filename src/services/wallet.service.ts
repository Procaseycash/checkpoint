import {BadRequestException, Component, Inject} from '@nestjs/common';
import {Wallet} from '../models/wallet';
import {generateKey, getNextSequenceValue, getOffsetAndCateria, getPaginated} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {messages} from '../config/messages.conf';
import {CURRENCY, modelCounter} from '../config/constants.conf';

@Component()
export class WalletService {
    constructor(@Inject('WalletRepo') private readonly walletRepo: Model<Wallet>,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    public async create(amount: { amount: number }) {
        const userWalletExist = await this.getWalletByConsumerId(ReqInstance.req.user.id);
        if (userWalletExist) throw new BadRequestException(messages.walletAlreadyExist);
        const wallet_no = generateKey();
        const wallet = {
            _id: await getNextSequenceValue(this.counterRepo, modelCounter.wallet),
            ...amount,
            consumer: ReqInstance.req.user.id,
            currency: CURRENCY,
            wallet_no,
        };
        const data = await this.walletRepo.create(wallet);
        if (!data) throw new BadRequestException(messages.failedCreation);
        return await this.getWalletById(wallet._id);
    }

    public async update(wallet: {amount: number , id: number}) {
        const data = await this.walletRepo.update({_id: wallet.id}, {$set: {amount: wallet.amount}});
        if (!data['nModified']) throw new BadRequestException(messages.unable);
        return await this.getWalletById(wallet.id);
    }

    public async remove(id: number) {
        const data = await this.walletRepo.delete({_id: id});
        if (!data || !data['nModified']) throw new BadRequestException(messages.failedToDelete);
        return true;
    }

    async getWalletById(id: number) {
        return await this.walletRepo.findOne({_id: id}).populate('consumer').exec();
    }

    async getWalletByConsumerId(id: number) {
        return await this.walletRepo.findOne({consumer: id}).populate('consumer').exec();
    }

    async getByWalletNo(wallet_no) {
        return await this.walletRepo.findOne({wallet_no}).populate('consumer').exec();
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.walletRepo.find().populate('consumer').sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.walletRepo, info);
    }
}
