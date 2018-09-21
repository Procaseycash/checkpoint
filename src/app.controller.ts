import {Get, Controller, Res} from '@nestjs/common';
import {ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('app')
@Controller()
export class AppController {
    @Get('/home')
    root(@Res() res): string {
        return res.render('app.html');
    }
}
