import {BadRequestException, Component, forwardRef, Inject} from '@nestjs/common';
import {Transaction} from '../models/transaction';
import {getNextSequenceValue, getOffsetAndCateria, getPaginated} from '../utils/utils';
import {Model} from 'mongoose';
import {Counter} from '../models/counter';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {messages} from '../config/messages.conf';
import {CURRENCY, modelCounter, PAYMENT_STATUS_CODES} from '../config/constants.conf';
import * as faker from 'faker';
import {TransactionReq} from '../requests/transaction.req';
import {TransactionEnum} from '../enums/transaction.enum';
import {MerchantService} from './merchant.service';
import {WalletService} from './wallet.service';
import {ENCRYPTION} from '../utils/encryption';
import {InsufficientBalance, TransactionFailure} from '../shared/filters/throwable.not.found';
import {MockPayment} from '../utils/mock.payment';

@Component()
export class TransactionService {
    constructor(@Inject('TransactionRepo') private readonly transactionRepo: Model<Transaction>,
                @Inject(forwardRef(() => MerchantService)) private readonly merchantService: MerchantService,
                private readonly walletService: WalletService,
                @Inject('CounterRepo') private readonly counterRepo: Model<Counter>) {
    }

    public async makePayment(payload: TransactionReq) {
        const travellerWallet = await this.walletService.getByWalletNo(payload.wallet_no);
        if (travellerWallet.amount < payload.amount) throw new InsufficientBalance(travellerWallet.amount);
        const merchantSecret = ENCRYPTION.decode(ReqInstance.req.headers.merchant_secret);
        const validateMerchant = await this.merchantService.validateMerchant(merchantSecret);
        if (!validateMerchant) throw new BadRequestException(messages.merchantSecretInValid);
        const storeInitTransaction = await this.create(payload);
        if (!storeInitTransaction) throw new TransactionFailure();
        merchantSecret.merchant_secret = undefined;
        merchantSecret.merchant_key = undefined;
        const pay = await MockPayment.pay(Object.assign(payload, merchantSecret));
        if (!(pay.status_code === PAYMENT_STATUS_CODES.remitaSuccess
                || pay.status_code === PAYMENT_STATUS_CODES.paystackSuccess)) throw new TransactionFailure();
        travellerWallet.amount -= payload.amount;
        await this.walletService.update(travellerWallet); // deduct amount paid from wallet
        return await this.update({
            id: storeInitTransaction._id,
            status: TransactionEnum.PAID,
            payment_reference: pay.payment_reference,
        });
    }

    public async create(payload: TransactionReq) {
        const transaction_reference = faker.random.uuid();
        const merchant = await this.merchantService.getMerchantByKey(ReqInstance.req.headers.merchant_key);
        const wallet = await this.walletService.getByWalletNo(payload.wallet_no);
        const transaction = {
            _id: await getNextSequenceValue(this.counterRepo, modelCounter.transaction),
            amount: payload.amount,
            item_name: payload.item_name,
            item_code: payload.item_code,
            traveller: wallet.traveller._id,
            merchant: merchant._id,
            currency: CURRENCY,
            status: TransactionEnum.PENDING,
            transaction_reference,
        };
        return await this.transactionRepo.create(transaction);
    }

    public async update(payload: { id: number, status: string, payment_reference: string }) {
        const data = await this.transactionRepo.update({_id: payload.id}, {
            $set: {
                status: payload.status,
                payment_reference: payload.payment_reference,
            },
        });
        if (!data['nModified']) throw new BadRequestException(messages.unable);
        return await this.getTransactionById(payload.id);
    }

    public async remove(id: number) {
        const data = await this.transactionRepo.delete({_id: id});
        if (!data || !data['nModified']) throw new BadRequestException(messages.failedToDelete);
        return true;
    }

    async getTransactionById(id: number) {
        return await this.transactionRepo.findOne({_id: id}).populate('traveller').populate('merchant').exec();
    }

    async getTransactionByTravellerId(id: number) {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.transactionRepo.find({traveller: id}).populate('traveller').populate('merchant')
            .sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.transactionRepo, info);
    }

    async getTransactionByMerchantId(id: number) {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.transactionRepo.find({merchant: id}).populate('traveller').populate('merchant')
            .sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.transactionRepo, info);
    }

    async getTransactionByMerchantSecret(secret: string) {
        const info = getOffsetAndCateria(ReqInstance.req);
        const merchant = await this.merchantService.decryptMerchantSecret({secret});
        const result = await this.transactionRepo.find({merchant: merchant['id']}).populate('traveller').populate('merchant')
            .sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.transactionRepo, info);
    }

    async findAll() {
        const info = getOffsetAndCateria(ReqInstance.req);
        const result = await this.transactionRepo.find().populate('traveller').populate('merchant').sort({_id: 1}).skip(info.offset).limit(info.nPerPage).exec();
        return await getPaginated(result, this.transactionRepo, info);
    }
}
