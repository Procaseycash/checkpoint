import {IsOptional, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class WalletNoReq {

    @ApiModelProperty({description: 'wallet number to find a wallet information', required: false})
    @IsOptional()
    @IsString()
    wallet_no: string;

}