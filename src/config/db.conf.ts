import {APP_ENV} from './app.config';
import * as config from './config.json';

console.log('config', config);
const DB = config;
export const DB_CONFIG = DB[APP_ENV];