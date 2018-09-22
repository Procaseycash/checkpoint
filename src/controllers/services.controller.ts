import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {ServicesService} from '../services/services.service';
import {Body, Controller, Get, Headers, Post, Response, Request} from '@nestjs/common';
import {RestfulRes} from '../response/restful.res';
import {messages} from '../config/messages.conf';
import {EmailReq} from '../requests/email.req';
import {LogoutEnum} from '../enums/logout.enum';
import {LogoutReq} from '../requests/logout.req';
import {ReqInstance} from '../shared/interceptors/req.instance';
import {UserEnum} from "../enums/user.enum";
import {Roles} from "../shared/decorators/roles.decorator";

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

    @ApiOAuth2Auth()
    @Roles(UserEnum.TRAVELLER, UserEnum.MERCHANT, UserEnum.SYSADMIN)
    @Post('account/logout')
    async logout(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Body() logoutReq: LogoutReq) {
        const user = ReqInstance.req.user;
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
