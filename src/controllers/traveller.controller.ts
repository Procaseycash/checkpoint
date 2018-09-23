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
import {TripInitReq} from "../requests/trip.init.req";
import {TripEndReq} from "../requests/trip.end.req";

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
    @ApiOperation({title: 'Phone number is optional, requires Traveller Auth Token'})
    async update(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number, @Body() traveller: UserUpdateReq) {
        const data = await this.travellerService.update(traveller);
        return data ? RestfulRes.success(res, messages.users.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    @ApiOperation({
        title: 'Get intentionally exposed',
        description: 'For the sake of test purposes, we expose the get travellers, ' +
        'use traveller Id on the authorize on swagger. This might return a list of users with same ID but pick the token of type that is traveller and use it in authorization'
    })
    async findAll(@Response() res, @Request() request) {
        const data = await this.travellerService.findAll();
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get(':id/check-in-history')
    @ApiOperation({title: 'Requires Traveller Auth Token'})
    async findAllTravellerCheckIn(@Response() res, @Headers('Authorization') authorization: string, @Request() request, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.travellerService.getTravellerCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Delete(':id')
    @ApiOperation({title: 'Requires SysAdmin Auth Token, try Id -500 in auth/:id'})
    async remove(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.travellerService.remove(id);
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }


    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get(':id/transactions')
    @ApiOperation({title: 'Requires Traveller Auth Token'})
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
    @ApiOperation({title: 'Requires Traveller Auth Token'})
    async fetchAUser(@Response() res, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.travellerService.getTravellerById(id);
        return data ? RestfulRes.success(res, messages.users.one.success, data) : RestfulRes.error(res, messages.users.one.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @ApiOperation({title: 'Requires Traveller Auth Token'})
    @Get(':id/wallets')
    async fetchByTravellerId(@Response() res, @Headers('Authorization') authorization: string,
                             @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.walletService.getWalletByTravellerId(id);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Post('init-trip')
    @ApiOperation({title: 'Requires Traveller Auth Token'})
    async initTrip(@Response() res, @Headers('Authorization') authorization: string,
                   @Body() tripPayload: TripInitReq) {
        const data = await this.travellerService.initTrip(tripPayload);
        return data ? RestfulRes.success(res, messages.tripOngoing, data) : RestfulRes.error(res, messages.tripFailedStart);
    }


    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Post('end-trip')
    @ApiOperation({title: 'Requires Traveller Auth Token'})
    async endTrip(@Response() res, @Headers('Authorization') authorization: string,
                  @Body() tripPayload: TripEndReq) {
        const data = await this.travellerService.endTrip(tripPayload);
        return data ? RestfulRes.success(res, messages.tripEnd, data) : RestfulRes.error(res, messages.tripFailedEnd);
    }

/*    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get('current-trip')
     @ApiOperation({title: 'Requires Traveller Auth Token'})
    async currentTrip(@Response() res, @Request() req, @Headers('Authorization') authorization: string) {
        const data = await this.travellerService.findCurrentTrip();
        return data ? RestfulRes.success(res, messages.currentTrip, data) : RestfulRes.error(res, messages.operationFailed);
    }*/
}
