import {HttpStatus} from '@nestjs/common';

export class RestfulRes {
    /**
     * For sucess response
     * @param res
     * @param message
     * @param data
     */
    public static success(res, message, data) {
        return res.status(HttpStatus.OK).json({data, statusCode: HttpStatus.OK, message});
    }
    /**
     * For failure response
     * @param res
     * @param message
     */
    public static error(res, message) {
        return res.status(HttpStatus.BAD_REQUEST).json({statusCode: HttpStatus.BAD_REQUEST, message});
    }
}