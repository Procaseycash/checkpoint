import {
    Controller, Get, Req, Response, Request, Post, Param,
    ParseIntPipe, Body, Put, Delete, Patch,
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {UserUpdateReq} from '../requests/user.update.req';
import {UserReq} from '../requests/user.req';
import {ServicesService} from '../services/services.service';
import {ChangePasswordReq} from '../requests/change.password.req';

@ApiUseTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService, private servicesService: ServicesService) {
    }

    @Post()
    @ApiOperation({title: 'Phone number is optional'})
    async post(@Response() res, @Request() req, @Body() user: UserReq) {
        const data = await this.userService.create(user);
        return data ? RestfulRes.success(res, messages.users.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Put(':id')
    @ApiOperation({title: 'Phone number is optional'})
    async update(@Response() res, @Request() req, @Param('id', new ParseIntPipe()) id: number, @Body() user_reg: UserUpdateReq) {
        const data = await this.userService.update(user_reg);
        return data ? RestfulRes.success(res, messages.users.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    async findAll(@Response() res, @Request() request) {
        const data = await this.userService.findAll();
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @Patch(':id/change_password')
    async changePassword(@Response() res, @Request() req, @Param('id', new ParseIntPipe()) id: number, @Body() passwordSettings: ChangePasswordReq) {
        console.log('id :: ', id);
        const data = await this.servicesService.changePassword(passwordSettings);
        return data ? RestfulRes.success(res, messages.passwordChanged, data) : RestfulRes.error(res, messages.passwordFailed);
    }

    @Get(':id/check-in-history')
    async findAllUserQueries(@Response() res, @Request() request, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.getUserCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    @Get('/check-in-history')
    async findAllQueries(@Response() res, @Request() request) {
        const data = await this.userService.getCheckInHistory();
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    @Delete(':id')
    async removeUser(@Response() res, @Request() req, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.remove(id);
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get(':id')
    async fetchAUser(@Response() res, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.getUserById(id);
        return data ? RestfulRes.success(res, messages.users.one.success, data) : RestfulRes.error(res, messages.users.one.failed);
    }
}
