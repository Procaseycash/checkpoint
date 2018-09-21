import {IsDefined, IsEmail, IsInt, IsString, Min, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class UserUpdateReq {

    @ApiModelProperty({description: 'User Identification Number'})
    @IsDefined()
    @IsInt()
    @Min(1)
    id: number;

    @ApiModelProperty({description: 'Phone number of an account'})
    @IsDefined()
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