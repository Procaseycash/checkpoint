import {IsString, IsDefined, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class TripEndReq {
    @ApiModelProperty({description: 'current destination latitude.'})
    @MinLength(3)
    @IsDefined()
    @IsString()
    destination_latitude: string;

    @ApiModelProperty({description: 'current destination longitude.'})
    @MinLength(3)
    @IsDefined()
    @IsString()
    destination_longitude: string;
}
