import {FileStorage} from './file_storage';
import * as redis from 'redis';
import * as _ from 'lodash';
import * as bluebird from 'bluebird';
import {REDIS_CONFIG} from '../config/redis.config';

export class Session extends FileStorage {
    static redis;

    /**
     * This is used to start  redis and authenticate to redis server to enable data storage.
     */
    static async startRedis() {
        await bluebird.promisifyAll(redis.RedisClient.prototype);
        await bluebird.promisifyAll(redis.Multi.prototype);
        const redisConfig = _.pickBy(REDIS_CONFIG);
        Session.redis = await redis.createClient(redisConfig);
        Session.redis.on('error', (err) => {
            console.log('Error Redis =', err);
        });
        // console.log('envSession=', APP_ENV, REDIS_CONFIG);
        /*   if (APP_ENV === 'production' && false) {
               Session.redis.auth(REDIS_CONFIG['password']);
           }*/
    }

    /**
     * This is used to ping a redis if active listening
     */
    static pingRedis() {
        return Session.redis.ping();
    }

    constructor() {
        super();
    }

}