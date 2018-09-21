import {APP_ENV, APP_ERROR_CODES} from './app.config';
import {ErrorLogEnum} from '../enums/error.log.enum';
import {LogService} from '../services/log.service';

const retry_strategy = (options) => {
    console.log('redisOptions=', options);
    if (options.error) {
        if (APP_ERROR_CODES.indexOf(options.error.code) === -1) {
            const logService = new LogService();
            logService.logError('REDIS_ERROR', options.error, ErrorLogEnum.REDIS);
        }
    }
    if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        return null; // new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        return null; // new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
};


/**
 * Redis options for different environment
 *
 */
const REDIS_OPTIONS = {
    production: {
        host: '127.0.0.1',
        port: 6379,
        path: null,
        url: null,
        string_numbers: null,
        return_buffers: false,
        detect_buffers: false,
        socket_keepalive: true,
        no_ready_check: false,
        enable_offline_queue: true,
        retry_unfulfilled_commands: false,
        password: null,
        db: null,
        family: 'IPv4',
        disable_resubscribing: false,
        rename_commands: null,
        tls: null,
        prefix: null,
        retry_strategy,
    },
    development: {
        host: '127.0.0.1',
        port: 6379,
        path: null,
        url: null,
        string_numbers: null,
        return_buffers: false,
        detect_buffers: false,
        socket_keepalive: true,
        no_ready_check: false,
        enable_offline_queue: true,
        retry_unfulfilled_commands: false,
        password: null,
        db: null,
        family: 'IPv4',
        disable_resubscribing: false,
        rename_commands: null,
        tls: null,
        prefix: null,
        retry_strategy,
    },
    test: {
        host: '127.0.0.1',
        port: 6379,
        path: null,
        url: null,
        string_numbers: null,
        return_buffers: false,
        detect_buffers: false,
        socket_keepalive: true,
        no_ready_check: false,
        enable_offline_queue: true,
        retry_unfulfilled_commands: false,
        password: null,
        db: null,
        family: 'IPv4',
        disable_resubscribing: false,
        rename_commands: null,
        tls: null,
        prefix: null,
        retry_strategy,
    },
};
export const REDIS_CONFIG = REDIS_OPTIONS[APP_ENV];