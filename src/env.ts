import {NotFoundException} from '@nestjs/common';
export enum EnvEnum {
    PRODUCTION = 'production',
    PROD = 'prod',
    DEVELOPMENT = 'development',
    DEV = 'dev',
    TEST = 'test',
    STAGING = 'staging',
}

/**
 * This is used to get current and set new env
 * @type {{get: ((environment: EnvEnum) => (string | EnvEnum | EnvEnum | any)); current: (() => string)}}
 */
export const ENV = {
    get: (environment: EnvEnum) => {
        if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === EnvEnum.PRODUCTION
            || process.env.NODE_ENV.trim() === EnvEnum.PROD) {
            return this.current();
        }
        switch (environment) {
            case EnvEnum.DEVELOPMENT:
                return EnvEnum.DEVELOPMENT;
            case EnvEnum.DEV:
                return EnvEnum.DEVELOPMENT;
            case EnvEnum.PRODUCTION:
                return EnvEnum.PRODUCTION;
            case EnvEnum.PROD:
                return EnvEnum.PRODUCTION;
            case EnvEnum.TEST:
                return EnvEnum.TEST;
            case EnvEnum.STAGING:
                return EnvEnum.STAGING;
            default:
                throw new NotFoundException('This environment is not allowed');
        }
    },
    current: () => {
        console.log('EnvCurrent=', process.env.NODE_ENV);
        return (process.env.NODE_ENV) ? process.env.NODE_ENV.trim() : 'development';
    },
};
