import {
    Controller, Get, Req, Headers, Response, Request, Post, Param,
    ParseIntPipe, Body, Put, Delete, Patch,
} from '@nestjs/common';
import {TravellerService} from '../services/traveller.service';
import {ApiOAuth2Auth, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {UserUpdateReq} from '../requests/user.update.req';
import {UserReq} from '../requests/user.req';
import {UserEnum} from '../enums/user.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import {TransactionService} from "../services/transaction.service";
import {WalletService} from "../services/wallet.service";

@ApiUseTags('travellers')
@Controller('travellers')
export class TravellerController {
    constructor(private travellerService: TravellerService,
                private walletService: WalletService,
                private readonly transactionService: TransactionService) {
    }

    @Post()
    @ApiOperation({title: 'Phone number is optional'})
    async post(@Response() res, @Request() req, @Body() traveller: UserReq) {
        const data = await this.travellerService.create(traveller);
        return data ? RestfulRes.success(res, messages.users.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Put(':id')
    @ApiOperation({title: 'Phone number is optional'})
    async update(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number, @Body() traveller: UserUpdateReq) {
        const data = await this.travellerService.update(traveller);
        return data ? RestfulRes.success(res, messages.users.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    @ApiOperation({title: 'Get intentionally exposed', description: 'For the sake of test purposes, we expose the get travellers, ' +
    'use traveller Id on the authorize on swagger. This might return a list of users with same ID but pick the token of type that is traveller and use it in authorization'})
    async findAll(@Response() res, @Request() request) {
        const data = await this.travellerService.findAll();
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get(':id/check-in-history')
    async findAllTravellerCheckIn(@Response() res, @Headers('Authorization') authorization: string, @Request() request, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.travellerService.getTravellerCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Delete(':id')
    async remove(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.travellerService.remove(id);
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }


    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get(':id/transactions')
    async getTransactions(@Response() res,
                          @Param('id', new ParseIntPipe()) id: number,
                          @Headers('Authorization') authorization: string,
                          @Request() req) {
        const data = await this.transactionService.getTransactionByTravellerId(id);
        return data ? RestfulRes.success(res, messages.list, data) : RestfulRes.error(res, messages.operationFailed);
    }


    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN, UserEnum.TRAVELLER)
    @Get(':id')
    async fetchAUser(@Response() res, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.travellerService.getTravellerById(id);
        return data ? RestfulRes.success(res, messages.users.one.success, data) : RestfulRes.error(res, messages.users.one.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get(':id/wallets')
    async fetchByTravellerId(@Response() res, @Headers('Authorization') authorization: string,
                            @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.walletService.getWalletByTravellerId(id);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }
}
