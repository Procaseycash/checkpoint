import {IsEmail, IsString, IsDefined, MinLength, IsOptional} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class AuthReq {
    @ApiModelProperty({description: 'Account account email'})
    @MinLength(5)
    @IsDefined()
    @IsString()
    email: string;

    @ApiModelProperty({description: 'account password'})
    @MinLength(7)
    @IsDefined()
    @IsString()
    password: string;


    @ApiModelProperty({description: 'The Ip Address in use', required: false})
    @IsOptional()
    @IsString()
    ip_address: string;

    @ApiModelProperty({description: 'The current browser in use', required: false})
    @IsOptional()
    @IsString()
    browser_agent: string;
}
