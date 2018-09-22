import {
    Body, Controller, Get, Request, Post, Headers, Response, ParseIntPipe, Param,
    Delete, Put, Query,
} from '@nestjs/common';
import {ApiOAuth2Auth, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {WalletService} from '../services/wallet.service';
import {UserEnum} from '../enums/user.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import {WalletReq} from '../requests/wallet.req';
import {WalletUpdateReq} from '../requests/wallet.update.req';
import {WalletNoReq} from "../requests/wallet.no.req";

@ApiUseTags('wallets')
@Controller('wallets')
export class WalletController {
    constructor(private walletService: WalletService) {
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Post()
    async post(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Body() wallet: WalletReq) {
        const data = await this.walletService.create(wallet);
        return data ? RestfulRes.success(res, messages.wallets.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Put(':id')
    async update(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number, @Body() wallet: WalletUpdateReq) {
        const data = await this.walletService.update(wallet);
        return data ? RestfulRes.success(res, messages.wallets.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    async findAll(@Response() res, @Request() request) {
        const data = await this.walletService.findAll();
        return data ? RestfulRes.success(res, messages.wallets.list.success, data) : RestfulRes.error(res, messages.wallets.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Delete(':id')
    async remove(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.walletService.remove(id);
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get(':id')
    async fetch(@Response() res, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.walletService.getWalletById(id);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get('travellers/:id')
    async fetchByTravellerId(@Response() res, @Headers('Authorization') authorization: string,
                            @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.walletService.getWalletByTravellerId(id);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }

    @Get(':wallet_no/by-merchant')
    @ApiOperation({title: 'This is used to get traveller wallet information from merchant terminal using her merchant\'s secret and key'})
    async getByWalletInfoByMerchantSecret(@Response() res,
                                          @Headers('merchant_secret') merchant_secret: string,
                                          @Headers('merchant_key') merchant_key: string,
                                          @Param('wallet_no') wallet_no: string) {
        const data = await this.walletService.getByWalletNoUsingMerchantSecret(merchant_secret, wallet_no);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER)
    @Get(':wallet_no/by-traveller')
    @ApiOperation({title: 'This is used to get traveller wallet information'})
    async fetchWalletInfo(@Response() res, @Headers('Authorization') authorization: string,
                          @Param('wallet_no') wallet_no: string) {
        const data = await this.walletService.getByWalletNo(wallet_no);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }
}
