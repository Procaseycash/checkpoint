import {PipeTransform, Pipe, ArgumentMetadata, HttpStatus, BadRequestException} from '@nestjs/common';

import {validate} from 'class-validator';
import {plainToClass} from 'class-transformer';

@Pipe()
export class ValidatorPipe implements PipeTransform<any> {
    private errors = [];

    async transform(value, metadata: ArgumentMetadata) {
        const {metatype} = metadata;
        console.log('value=', value, 'metaData=', JSON.stringify(metadata), 'metatype=', metatype);
        if (!this.toValidate(metatype)) {
            return value;
        }
        const classObj = plainToClass(metatype, value);

        console.log('objectData=', classObj);
        const errors = await validate(classObj, {validationError: {target: false}});
        console.log('errors=', errors);
        if (errors.length > 0) {
            this.formatError(errors);
            throw new BadRequestException(this.errors);
        }
        return value;
    }

    private toValidate(metatype = null): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => type === metatype);
    }

    private formatError(errors) {
        this.errors = [];
        this.errorPusher(errors);
        return this.errors;
    }

    private errorPusher(errors) {
        let obj = {};
        errors.forEach((error, i) => {
            Object.entries(error.constraints).forEach(([key, value]) => {
                obj[error.property] = value;
                this.errors.push(obj);
                obj = {};
            });
            if (error.children && error.children.length > 0) {
                this.errorPusher(error.children);
            }
        });
    }
}