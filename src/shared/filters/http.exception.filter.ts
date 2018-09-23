import {ExceptionFilter, Catch, HttpException, Response, HttpStatus} from '@nestjs/common';
import {ErrorLogEnum} from "../../enums/error.log.enum";
import {APP_ERROR_CODES} from "../../config/app.config";
import {LogService} from "../../services/log.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private statusCode = HttpStatus.BAD_REQUEST;

    constructor(private readonly logService: LogService) {
    }

    catch(exception: HttpException, @Response() response) {
        const message = this.getMessage(exception.getResponse());
        const statusCode = this.statusCode;
        console.log({statusCode, message});
        if (APP_ERROR_CODES.indexOf(statusCode) === -1) {
            this.logService.logError('APPLICATION_ERROR', exception.getResponse(), ErrorLogEnum.APPLICATION);
        }
        response.status(statusCode).json({statusCode, message});
    }

    /**
     * This is used to filter out message from nested responses.
     * @param messages
     * @returns {any}
     */
    private getMessage(messages) {
        console.log('HereRrror', messages);
        let message = null;
        if (messages.constructor === Object) {
            console.log('I was here');
            Object.entries(messages).forEach(([key, value]) => {
                if (key === 'message') {
                    message = this.getMessage(value);
                    this.statusCode = (value.constructor === Object && value['statusCode']) ? value['statusCode'] : this.statusCode;
                }
            });
        } else {
            message = messages;
        }

        return message;
    }
}