import {ExceptionFilter, Catch, HttpException, Response} from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, @Response() response) {
        const statusCode = exception.getStatus();
        const responseData = exception.getResponse();
        const message = (responseData.constructor === String) ? {message: responseData} : responseData;
        response.status(statusCode).json({
            statusCode,
            ...{message},
        });
    }
}