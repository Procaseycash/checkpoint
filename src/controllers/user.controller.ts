import {
    Controller, Get, Req, Headers, Response, Request, Post, Param,
    ParseIntPipe, Body, Put, Delete, Patch,
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {ApiOAuth2Auth, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {ServicesService} from '../services/services.service';
import {ChangePasswordReq} from '../requests/change.password.req';
import {UserEnum} from '../enums/user.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import {TravellerService} from '../services/traveller.service';

@ApiUseTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService,
                private travellerService: TravellerService,
                private servicesService: ServicesService) {
    }

    @ApiOAuth2Auth()
    @ApiOperation({title: 'Requires Any kinds of user Auth Token and information must be of that of the token'})
    @Roles(UserEnum.MERCHANT, UserEnum.TRAVELLER, UserEnum.SYSADMIN)
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
    @ApiOperation({title: 'Requires Sysadmin Auth Token, try Id=500 in auth/:id'})
    async findAllCheckIn(@Response() res, @Headers('Authorization') authorization: string, @Request() request) {
        const data = await this.travellerService.getCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }
}
