import {IsDefined, IsInt, Min} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {WalletReq} from "./wallet.req";

export class WalletUpdateReq extends WalletReq {

    @ApiModelProperty({description: 'Identification no for wallet account'})
    @IsDefined()
    @IsInt()
    @Min(1)
    id: number;

}