import {
    Body, Controller, Get, Request, Post, Response, ParseIntPipe, Param,
    Delete, Put,
} from '@nestjs/common';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {WalletService} from '../services/wallet.service';
import {UserEnum} from '../enums/user.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import {WalletReq} from '../requests/wallet.req';
import {WalletUpdateReq} from '../requests/wallet.update.req';

@ApiUseTags('wallets')
@Controller('wallets')
export class WalletController {
    constructor(private walletService: WalletService) {
    }

    @Post()
    async post(@Response() res, @Request() req, @Body() wallet: WalletReq) {
        const data = await this.walletService.create(wallet);
        return data ? RestfulRes.success(res, messages.wallets.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.CONSUMER)
    @Put(':id')
    async update(@Response() res, @Request() req,  @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number, @Body() wallet: WalletUpdateReq) {
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
    @Roles(UserEnum.SYSADMIN, UserEnum.CONSUMER)
    @Get(':id')
    async fetch(@Response() res, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.walletService.getWalletById(id);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN, UserEnum.CONSUMER)
    @Get(':id/consumers/:cus_id')
    async fetchByConsumerId(@Response() res, @Headers('Authorization') authorization: string,
                            @Param('id', new ParseIntPipe()) id: number,
                            @Param('cus_id', new ParseIntPipe()) cusId: number) {
        const data = await this.walletService.getWalletByConsumerId(cusId);
        return data ? RestfulRes.success(res, messages.wallets.one.success, data) : RestfulRes.error(res, messages.wallets.one.failed);
    }
}
