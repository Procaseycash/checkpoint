import {
    Controller, Get, Req, Headers, Response, Request, Post, Param,
    ParseIntPipe, Body, Put, Delete, Patch,
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {ApiOAuth2Auth, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {UserUpdateReq} from '../requests/user.update.req';
import {UserReq} from '../requests/user.req';
import {ServicesService} from '../services/services.service';
import {ChangePasswordReq} from '../requests/change.password.req';
import {UserEnum} from '../enums/user.enum';
import {Roles} from '../shared/decorators/roles.decorator';

@ApiUseTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService, private servicesService: ServicesService) {
    }

    @Post()
    @ApiOperation({title: 'Phone number is optional'})
    async post(@Response() res, @Request() req, @Body() user: UserReq) {
        const data = await this.userService.create(user, UserEnum.CLIENT_USER);
        return data ? RestfulRes.success(res, messages.users.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.CLIENT_USER)
    @Put(':id')
    @ApiOperation({title: 'Phone number is optional'})
    async update(@Response() res, @Request() req,  @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number, @Body() user_reg: UserUpdateReq) {
        const data = await this.userService.update(user_reg);
        return data ? RestfulRes.success(res, messages.users.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    async findAll(@Response() res, @Request() request) {
        const data = await this.userService.findAll();
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.CLIENT_USER)
    @Patch(':id/change_password')
    async changePassword(@Response() res, @Headers('Authorization') authorization: string, @Request() req, @Param('id', new ParseIntPipe()) id: number, @Body() passwordSettings: ChangePasswordReq) {
        const data = await this.servicesService.changePassword(passwordSettings);
        return data ? RestfulRes.success(res, messages.passwordChanged, data) : RestfulRes.error(res, messages.passwordFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.CLIENT_USER)
    @Get(':id/check-in-history')
    async findAllUserQueries(@Response() res, @Headers('Authorization') authorization: string, @Request() request, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.getUserCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Get('/check-in-history')
    async findAllQueries(@Response() res, @Headers('Authorization') authorization: string, @Request() request) {
        const data = await this.userService.getCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN)
    @Delete(':id')
    async removeUser(@Response() res, @Request() req, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.remove(id);
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @ApiOAuth2Auth()
    @Roles(UserEnum.SYSADMIN, UserEnum.CLIENT_USER)
    @Get(':id')
    async fetchAUser(@Response() res, @Headers('Authorization') authorization: string, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.getUserById(id);
        return data ? RestfulRes.success(res, messages.users.one.success, data) : RestfulRes.error(res, messages.users.one.failed);
    }
}
