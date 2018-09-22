import {IsDefined, IsNumber, Min} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class WalletReq {

    @ApiModelProperty({description: 'Amount to fund in wallet'})
    @IsDefined()
    @IsNumber()
    @Min(1)
    amount: number;

}