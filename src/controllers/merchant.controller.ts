import {
    Controller, Get, Req, Headers, Response, Request, Post, Param,
    ParseIntPipe, Body, Put, Delete, Patch,
} from '@nestjs/common';
import {MerchantService} from '../services/merchant.service';
import {ApiOAuth2Auth, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {UserEnum} from '../enums/user.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import {MerchantUpdateReq} from "../requests/merchant.update.req";
import {MerchantReq} from "../requests/merchant.req";
import {MerchantSecreteReq} from "../requests/merchant.secrete.req";
import {TransactionService} from "../services/transaction.service";
import {TransactionReq} from "../requests/transaction.req";

@ApiUseTags('merchants')
@Controller('merchants')
export class MerchantController {
    constructor(private readonly merchantService: MerchantService,
                private readonly transactionService: TransactionService) {
    }

    @Post()
    @ApiOperation({title: 'Phone number is optional'})
    async post(@Response() res, @Request() req, @Body() merchant: MerchantReq) {
        const data = await this.merchantService.create(merchant);
        return data ? RestfulRes.success(res, messages.users.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Post('generate-secret')
    async generateSecret(@Response() res, @Headers('merchant_key') merchant_key: string, @Request() req, @Body() merchant: MerchantSecreteReq) {
        const data = await this.merchantService.generateMerchantSecret(merchant);
        return data ? RestfulRes.success(res, messages.generatedSecret, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Post('pay')
    @ApiOperation({title: 'This is used to process merchant payments from merchant terminal using her merchant\'s secret and key'})
    async makePayment(@Response() res,
                      @Headers('merchant_secret') merchant_secret: string,
                      @Headers('merchant_key') merchant_key: string,
                      @Request() req, @Body() transaction: TransactionReq) {
        const data = await this.transactionService.makePayment(transaction);
        return data ? RestfulRes.success(res, messages.paymentSuccessful, data) : RestfulRes.error(res, messages.paymentFailed);
    }

    @Get('transactions')
    @ApiOperation({title: 'This is used to get merchant transactions from merchant terminal using her merchant\'s secret and key'})
    async getTransactionsUsingSecret(@Response() res,
                                     @Headers('merchant_secret') merchant_secret: string,
                                     @Headers('merchant_key') merchant_key: string,
                                     @Request() req) {
        const data = await this.transactionService.getTransactionByMerchantSecret(merchant_secret);
        return data ? RestfulRes.success(res, messages.list, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.MERCHANT)
    @ApiOperation({title: 'Requires Merchant Auth Token'})
    @Get(':id/transactions')
    async getTransactions(@Response() res,
                          @Param('id', new ParseIntPipe()) id: number,
                          @Headers('Authorization') authorization: string,
                          @Request() req) {
        const data = await this.transactionService.getTransactionByMerchantId(id);
        return data ? RestfulRes.success(res, messages.list, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.MERCHANT)
    @Put(':id')
    @ApiOperation({title: 'Phone number is optional, Requires Merchant Auth Token'})
    async update(@Response() res, @Request() req,
                 @Headers('Authorization') authorization: string,
                 @Param('id', new ParseIntPipe()) id: number, @Body() merchant: MerchantUpdateReq) {
        const data = await this.merchantService.update(merchant);
        return data ? RestfulRes.success(res, messages.users.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    @ApiOperation({
        title: 'Get intentionally exposed',
        description: 'For the sake of test purposes, we expose the get merchants, ' +
        'use merchant Id on the authorize on swagger. This might return a list of users with same ID but pick the token of type that is merchant and use it in authorization'
    })
    async findAll(@Response() res, @Request() request) {
        const data = await this.merchantService.findAll();
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Delete(':id')
    @ApiOperation({title: 'Requires SYSADMIN Auth Token; use id:500 in auth/:id'})
    async remove(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.merchantService.remove(id);
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN, UserEnum.MERCHANT)
    @Get(':id')
    @ApiOperation({title: 'Requires Merchant Auth Token'})
    async fetchAUser(@Response() res, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.merchantService.getMerchantById(id);
        return data ? RestfulRes.success(res, messages.users.one.success, data) : RestfulRes.error(res, messages.users.one.failed);
    }
}
