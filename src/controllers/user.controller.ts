import {
    Controller, Get, Req, Headers, Response, Request, Post, Param,
    ParseIntPipe, Body, Put, Delete, Patch,
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {ApiOAuth2Auth, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {ServicesService} from '../services/services.service';
import {ChangePasswordReq} from '../requests/change.password.req';
import {UserEnum} from '../enums/user.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import {ConsumerService} from '../services/consumer.service';

@ApiUseTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService,
                private consumerService: ConsumerService,
                private servicesService: ServicesService) {
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.DRIVER, UserEnum.MERCHANT, UserEnum.CONSUMER, UserEnum.SYSADMIN)
    @Patch(':id/change_password')
    async changePassword(@Response() res, @Headers('Authorization') authorization: string, @Request() req, @Param('id', new ParseIntPipe()) id: number, @Body() passwordSettings: ChangePasswordReq) {
        const data = await this.servicesService.changePassword(passwordSettings);
        return data ? RestfulRes.success(res, messages.passwordChanged, data) : RestfulRes.error(res, messages.passwordFailed);
    }

    @Get('login-credentials')
    async findAll(@Response() res, @Request() request) {
        const data = await this.userService.findAll();
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Get('/check-in-history')
    async findAllCheckIn(@Response() res, @Headers('Authorization') authorization: string, @Request() request) {
        const data = await this.consumerService.getCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }
}
