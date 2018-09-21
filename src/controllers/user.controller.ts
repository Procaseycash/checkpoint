import {
    Controller, Get, HttpStatus, Req, Response, Request, HttpException, Post, Param,
    ParseIntPipe, Body, Put, Delete,
} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {UserEnum} from '../enums/user.enum';
import {NormalUserReq} from '../requests/normalUser.req';
import {NormalUserUpdateReq} from "../requests/norrmaluser.update.req";

@ApiUseTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post()
    @ApiOperation({title: 'Phone number is optional'})
    async post(@Response() res, @Request() req, @Body() user: NormalUserReq) {
        console.log('user creation :: ', user);
        const data = await this.userService.create(user, UserEnum.QUERER, req);
        // Please pay attention to messages to be returned and make sure right messages are returned
        return data ? RestfulRes.success(res, messages.users.created, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Put(':id')
    @ApiOperation({title: 'Phone number is optional'})
    async update(@Response() res, @Request() req, @Param('id', new ParseIntPipe()) id: number, @Body() user_reg: NormalUserUpdateReq) {
        const data = await this.userService.update(user_reg, UserEnum.QUERER, req);
        // Please pay attention to messages to be returned and make sure right messages are returned
        return data ? RestfulRes.success(res, messages.users.updated, data) : RestfulRes.error(res, messages.operationFailed);
    }

    @Get()
    async findAll(@Response() res, @Request() request) {
        const data = await this.userService.findAll(request);
        return data ? RestfulRes.success(res, messages.users.list.success, data) : RestfulRes.error(res, messages.users.list.failed);
    }

    @Get(':id/search-history')
    async findAllUserQueries(@Response() res, @Request() request, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.getUserSearchHistory(request);
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    @Get('/search-history')
    async findAllQueries(@Response() res, @Request() request) {
        const data = await this.userService.getSearchHistory(request);
        return data ? RestfulRes.success(res, messages.history.list.success, data) : RestfulRes.error(res, messages.history.list.failed);
    }

    /**
     * This is used to delete a user
     * @param res
     * @param req
     * @param id
     * @returns {Promise<void>}
     */
    @Delete(':id')
    async removeUser(@Response() res, @Request() req, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.remove(id, req);
        // Please pay attention to messages to be returned and make sure right messages are returned
        return data ? RestfulRes.success(res, messages.deleteSuccess, data) : RestfulRes.error(res, messages.operationFailed);
    }

    /**
     * This is used to fetch a user (Implemented by Kazeem)
     * @param res
     * @param id
     * @returns {Promise<void>}
     */
    @Get(':id')
    async fetchAUser(@Response() res, @Param('id', new ParseIntPipe()) id: number) {
        const data = await this.userService.getUserById(id, UserEnum.QUERER);
        return data ? RestfulRes.success(res, messages.users.one.success, data) : RestfulRes.error(res, messages.users.one.failed);
    }
}
