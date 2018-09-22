import {IsEmail, IsString, IsDefined, MinLength, IsOptional} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class UserReq {
    @ApiModelProperty({description: 'Password of an account'})
    @MinLength(8)
    @IsDefined()
    @IsString()
    password: string;

    @ApiModelProperty({description: 'Phone number of an account', required: false})
    @IsOptional()
    @MinLength(11)
    phone_no: string;

    @ApiModelProperty({description: 'First Name'})
    @MinLength(3)
    @IsDefined()
    @IsString()
    first_name: string;

    @ApiModelProperty({description: 'Last Name'})
    @MinLength(3)
    @IsDefined()
    @IsString()
    last_name: string;

    @ApiModelProperty({description: 'Email of an account'})
    @IsDefined()
    @IsEmail()
    email: string;

}
