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

@ApiUseTags('merchants')
@Controller('merchants')
export class MerchantController {
    constructor(private merchantService: MerchantService) {
    }

    @Post()
    @ApiOperation({title: 'Phone number is optional'})
    async post(@Response() res, @Request() req, @Body() merchant: MerchantReq) {
        const data = await this.merchantService.create(merchant);
        return data ? RestfulRes.success(res, messages.users.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.MERCHANT)
    @Put(':id')
    @ApiOperation({title: 'Phone number is optional'})
    async update(@Response() res, @Request() req,  @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number, @Body() merchant: MerchantUpdateReq) {
        const data = await this.merchantService.update(merchant);
        return data ? RestfulRes.success(res, messages.users.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    async findAll(@Response() res, @Request() request) {
        const data = await this.merchantService.findAll();
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Delete(':id')
    async remove(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.merchantService.remove(id);
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN, UserEnum.MERCHANT)
    @Get(':id')
    async fetchAUser(@Response() res, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.merchantService.getMerchantById(id);
        return data ? RestfulRes.success(res, messages.users.one.success, data) : RestfulRes.error(res, messages.users.one.failed);
    }
}
