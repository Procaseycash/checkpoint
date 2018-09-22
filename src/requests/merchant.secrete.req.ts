import {IsString, IsDefined, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class MerchantSecreteReq {
    @ApiModelProperty({description: 'Account email'})
    @MinLength(5)
    @IsDefined()
    @IsString()
    email: string;

    @ApiModelProperty({description: 'account password'})
    @MinLength(7)
    @IsDefined()
    @IsString()
    password: string;
}
