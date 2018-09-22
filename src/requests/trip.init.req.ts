import {IsString, IsDefined, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class TripInitReq {
    @ApiModelProperty({description: 'user define current location. use Latitude,Longitude without space or CountryCode,CityName'})
    @MinLength(3)
    @IsDefined()
    @IsString()
    user_origin_location: string;

    @ApiModelProperty({description: 'gps auto destination locator. use Latitude,Longitude without space or CountryCode,CityName'})
    @MinLength(3)
    @IsDefined()
    @IsString()
    gps_origin_location: string;

    @ApiModelProperty({description: 'user define current location. use Latitude,Longitude without space or CountryCode,CityName'})
    @MinLength(3)
    @IsDefined()
    @IsString()
    user_destination_location: string;

    @ApiModelProperty({description: 'gps auto destination locator. use Latitude,Longitude without space or CountryCode,CityName'})
    @MinLength(3)
    @IsDefined()
    @IsString()
    gps_destination_location: string;

}
