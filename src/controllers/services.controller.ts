import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {ServicesService} from '../services/services.service';
import {Body, Controller, Get, Patch, Post, Response, Request, Param, ParseIntPipe, Delete, Put} from '@nestjs/common';
import {RestfulRes} from '../response/restful.res';
import {messages} from '../config/messages.conf';
import {ChangePasswordReq} from '../requests/change.password.req';
import {EmailReq} from '../requests/email.req';
import {jwt} from '../utils/jwt';
import {LogoutEnum} from '../enums/logout.enum';
import {LogoutReq} from '../requests/logout.req';

@ApiUseTags('services')
@Controller('services')
export class ServicesController {
    constructor(private servicesService: ServicesService) {
    }

    @Get('enums')
    findAllEnums(@Response() res) {
        const data = this.servicesService.getEnums();
        return data ? RestfulRes.success(res, messages.list, data) : RestfulRes.error(res, messages.failed);
    }

    @Post('account/logout')
    async logout(@Response() res, @Request() req, @Body() logoutReq: LogoutReq) {
        const user = jwt.decode(req.headers.authorization);
        const logout_by = (logoutReq && logoutReq.logout_by) ? logoutReq.logout_by : LogoutEnum.USER;
        const data = await this.servicesService.logout(logout_by, user.ref_token);
        return RestfulRes.success(res, messages.logoutSuccess, data);
    }

    @Post('account/new_password')
    async generateNewPassword(@Response() res, @Request() req, @Body() emailReq: EmailReq) {
        const data = await this.servicesService.generateNewPassword(emailReq.email, true);
        return RestfulRes.success(res, messages.newPasswordGen, data);
    }
}
