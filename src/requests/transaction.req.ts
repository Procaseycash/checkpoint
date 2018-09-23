import {IsDefined, IsNumber, IsString, MaxLength, Min, MinLength} from "class-validator";
import {ApiModelProperty} from "@nestjs/swagger";

export class TransactionReq {
    @ApiModelProperty({description: 'Item Amount from Merchant terminal'})
    @IsDefined()
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiModelProperty({description: 'Item Name from Merchant terminal'})
    @MinLength(5)
    @IsDefined()
    @IsString()
    item_name: string;


    @ApiModelProperty({description: 'Item Code from Merchant terminal'})
    @MinLength(2)
    @IsDefined()
    @IsString()
    item_code: string;


    @ApiModelProperty({description: 'Customer/Traveller Wallet No to be provided'})
    @MinLength(15)
    @IsDefined()
    @IsString()
    wallet_no: string;
}