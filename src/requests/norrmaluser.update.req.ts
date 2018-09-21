import {IsEmail, IsString, IsDefined, MinLength, IsOptional, IsInt, Min} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class NormalUserUpdateReq {
    @ApiModelProperty({description: 'Phone number of an account'})
    @IsOptional()
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

    @ApiModelProperty({description: 'Office address of an account'})
    @IsDefined()
    @IsString()
    address: string;

    @ApiModelProperty({description: 'Company Name of an account'})
    @IsDefined()
    @IsString()
    company: string;

    @ApiModelProperty({description: 'User Identification Number'})
    @IsDefined()
    @IsInt()
    @Min(1)
    id: number;

}
