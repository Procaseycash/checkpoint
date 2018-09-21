import {Get, Controller, Res} from '@nestjs/common';
import {ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('app')
@Controller('home')
export class AppController {
    @Get()
    root(@Res() res): string {
        return res.render('app.html');
    }
}
