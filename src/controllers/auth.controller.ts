import {Body, Controller, Get, Request, Post, Response, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {AuthReq} from '../requests/auth.req';
import {messages} from '../config/messages.conf';
import {RestfulRes} from '../response/restful.res';
import {DecodeEncryptedRequestInterceptor} from '../shared/interceptors/decode.encrypted.request.interceptor';
import {ServicesService} from '../services/services.service';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private servicesService: ServicesService) {
    }

    @Post()
    @UseInterceptors(DecodeEncryptedRequestInterceptor)
    @ApiOperation({title: 'The browser agent and ip_address is optional'})
    async authenticate(@Response() res, @Body() req: AuthReq) {
        const data = await this.servicesService.authenticate(req);
        console.log('resp=', data);
        return data ? RestfulRes.success(res, messages.auth.success, data) : RestfulRes.error(res, messages.auth.failed);
    }

    @Get('token')
    async getUserToken(@Response() res, @Request() req) {
        const data = await this.servicesService.getToken(+req.query.client_id);
        console.log('resp=', data);
        return data ? RestfulRes.success(res, messages.auth.success, data) : RestfulRes.error(res, messages.auth.failed);
    }
}
