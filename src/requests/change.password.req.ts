import {IsString, IsDefined, MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class ChangePasswordReq {

    @ApiModelProperty({description: 'New Password Field'})
    @MinLength(8)
    @IsDefined()
    @IsString()
    new_password: string;

    @ApiModelProperty({description: 'Previous Password Field'})
    @MinLength(8)
    @IsDefined()
    @IsString()
    old_password: string;

    @ApiModelProperty({description: 'Confirm Password field'})
    @MinLength(8)
    @IsDefined()
    @IsString()
    confirm_password: string;
}
