import {
    Controller, Get, Req, Headers, Response, Request, Post, Param,
    ParseIntPipe, Body, Put, Delete, Patch,
} from '@nestjs/common';
import {ConsumerService} from '../services/consumer.service';
import {ApiOAuth2Auth, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {UserUpdateReq} from '../requests/user.update.req';
import {UserReq} from '../requests/user.req';
import {UserEnum} from '../enums/user.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import {TransactionService} from "../services/transaction.service";
import {WalletService} from "../services/wallet.service";

@ApiUseTags('consumers')
@Controller('consumers')
export class ConsumerController {
    constructor(private consumerService: ConsumerService,
                private walletService: WalletService,
                private readonly transactionService: TransactionService) {
    }

    @Post()
    @ApiOperation({title: 'Phone number is optional'})
    async post(@Response() res, @Request() req, @Body() consumer: UserReq) {
        const data = await this.consumerService.create(consumer);
        return data ? RestfulRes.success(res, messages.users.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.CONSUMER)
    @Put(':id')
    @ApiOperation({title: 'Phone number is optional'})
    async update(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number, @Body() consumer: UserUpdateReq) {
        const data = await this.consumerService.update(consumer);
        return data ? RestfulRes.success(res, messages.users.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    @ApiOperation({title: 'Get intentionally exposed', description: 'For the sake of test purposes, we expose the get consumers, ' +
    'use consumer Id on the authorize on swagger. This might return a list of users with same ID but pick the token of type that is consumer and use it in authorization'})
    async findAll(@Response() res, @Request() request) {
        const data = await this.consumerService.findAll();
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.CONSUMER)
    @Get(':id/check-in-history')
    async findAllConsumerCheckIn(@Response() res, @Headers('Authorization') authorization: string, @Request() request, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.consumerService.getConsumerCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Delete(':id')
    async remove(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.consumerService.remove(id);
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }


    @ApiOAuth2Auth()
    @Roles(UserEnum.CONSUMER)
    @Get(':id/transactions')
    async getTransactions(@Response() res,
                          @Param('id', new ParseIntPipe()) id: number,
                          @Headers('Authorization') authorization: string,
                          @Request() req) {
        const data = await this.transactionService.getTransactionByConsumerId(id);
        return data ? RestfulRes.success(res, messages.list, data) : RestfulRes.error(res, messages.operationFailed);
    }


    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN, UserEnum.CONSUMER)
    @Get(':id')
    async fetchAUser(@Response() res, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.consumerService.getConsumerById(id);
        return data ? RestfulRes.success(res, messages.users.one.success, data) : RestfulRes.error(res, messages.users.one.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.CONSUMER)
    @Get(':id/wallets')
    async fetchByConsumerId(@Response() res, @Headers('Authorization') authorization: string,
                            @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.walletService.getWalletByConsumerId(id);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }
}
