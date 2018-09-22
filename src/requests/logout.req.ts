import {IsOptional, IsString, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {LogoutEnum} from '../enums/logout.enum';

export class LogoutReq {

    @ApiModelProperty({type: String, description: 'This is an enum for logout, Please provide only if traveller is logged out by Admin',
        enum: [LogoutEnum.SYSADMIN, LogoutEnum.USER]})
    @IsOptional()
    @IsString()
    @MinLength(4)
    logout_by: string;

}