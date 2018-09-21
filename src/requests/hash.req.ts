import {IsDefined, IsString, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class HashReq {

    @ApiModelProperty({description: 'The hash value needed to process information'})
    @IsDefined()
    @IsString()
    @MinLength(8)
    hash: string;

}