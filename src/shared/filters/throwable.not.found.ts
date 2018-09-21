import {HttpStatus, HttpException} from '@nestjs/common';

export class NotFoundException extends HttpException {
    constructor(msg: string | object) {
        super(msg, HttpStatus.NOT_FOUND);
    }
}

export class UserNotFoundException extends NotFoundException {
    constructor() {
        super('User not found.');
    }
}