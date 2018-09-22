import {BadRequestException, Component, forwardRef, Inject} from '@nestjs/common';
import {Transaction} from '../models/transaction';
import {getNextSequenceValue, getOffsetAndCateria, getPaginated} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {messages} from '../config/messages.conf';
import {CURRENCY, modelCounter} from '../config/constants.conf';
import * as faker from 'faker';
import {TransactionReq} from '../requests/transaction.req';
import {TransactionEnum} from '../enums/transaction.enum';
import {MerchantService} from './merchant.service';
import {WalletService} from './wallet.service';
import {ENCRYPTION} from "../utils/encryption";

@Component()
export class TransactionService {
    constructor(@Inject('TransactionRepo') private readonly transactionRepo: Model<Transaction>,
                @Inject(forwardRef(() => MerchantService)) private readonly merchantService: MerchantService,
                private readonly walletService: WalletService,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    public async create(payload: TransactionReq) {
        const merchantSecret = ENCRYPTION.decode(ReqInstance.req.headers.merchant_secret);
        const validateMerchant = await this.merchantService.validateMerchant(merchantSecret);
        if (!validateMerchant) throw new BadRequestException(messages.merchantSecretInValid);
        const transaction_reference = faker.random.uuid();
        const merchant = await this.merchantService.getMerchantByKey(ReqInstance.req.headers.merchant_key);
        const wallet = await this.walletService.getByWalletNo(payload.wallet_no);
        const transaction = {
            _id: await getNextSequenceValue(this.counterRepo, modelCounter.transaction),
            amount: payload.amount,
            item_name: payload.item_name,
            item_code: payload.item_code,
            consumer: wallet.consumer._id,
            merchant: merchant._id,
            currency: CURRENCY,
            status: TransactionEnum.PENDING,
            transaction_reference,
        };
        return await this.transactionRepo.create(transaction);
    }

    public async update(payload: { id: number, status: string }) {
        const data = await this.transactionRepo.update({_id: payload.id}, {$set: {status: payload.status}});
        if (!data['nModified']) throw new BadRequestException(messages.unable);
        return await this.getTransactionById(payload.id);
    }

    public async remove(id: number) {
        const data = await this.transactionRepo.delete({_id: id});
        if (!data || !data['nModified']) throw new BadRequestException(messages.failedToDelete);
        return true;
    }

    async getTransactionById(id: number) {
        return await this.transactionRepo.findOne({_id: id}).populate('consumer').populate('merchant').exec();
    }

    async getTransactionByConsumerId(id: number) {
        return await this.transactionRepo.find({consumer: id}).populate('consumer').populate('merchant').exec();
    }

    async getTransactionByMerchantId(id: number) {
        return await this.transactionRepo.find({merchant: id}).populate('consumer').populate('merchant').exec();
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.transactionRepo.find().populate('consumer').populate('merchant').sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.transactionRepo, info);
    }
}
