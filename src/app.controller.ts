import {Get, Controller, Res} from '@nestjs/common';
import {ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('app')
@Controller()
export class AppController {
    @Get()
    root(@Res() res): string {
        return res.redirect('/api');
    }

}
