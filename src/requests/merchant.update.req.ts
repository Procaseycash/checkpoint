import {IsDefined, IsEmail, IsInt, IsString, MaxLength, Min, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {UserUpdateReq} from "./user.update.req";

export class MerchantUpdateReq extends UserUpdateReq {
    @ApiModelProperty({description: 'Merchant Bank Account Number'})
    @MinLength(10)
    @MaxLength(10)
    @IsDefined()
    @IsString()
    account_no: string;

    @ApiModelProperty({description: 'Merchant Bank Account Name'})
    @MinLength(5)
    @IsDefined()
    @IsString()
    account_name: string;

    @ApiModelProperty({description: 'Bank Account Code'})
    @MaxLength(3)
    @IsDefined()
    @IsString()
    bank_code: string;

    @ApiModelProperty({description: 'Name of Bank Account'})
    @MinLength(5)
    @IsDefined()
    @IsString()
    bank_name: string;

}