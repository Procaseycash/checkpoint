import {ExceptionFilter, Catch, HttpException, Response, HttpStatus} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private statusCode = HttpStatus.BAD_REQUEST;

    constructor() {
    }

    catch(exception: HttpException, @Response() response) {
        const message = this.getMessage(exception.getResponse());
        const statusCode = this.statusCode;
        console.log({statusCode, message});
        response.status(statusCode).json({statusCode, message});
    }

    /**
     * This is used to filter out message from nested responses.
     * @param messages
     * @returns {any}
     */
    private getMessage(messages) {
        console.log('Here', messages);
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