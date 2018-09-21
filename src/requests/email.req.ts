import {IsDefined, IsEmail} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class EmailReq {

    @ApiModelProperty({description: 'Email of address'})
    @IsDefined()
    @IsEmail()
    email: string;

}