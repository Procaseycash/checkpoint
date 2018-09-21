import * as fs from 'fs';
import {NotFoundException} from '@nestjs/common';
import {messages} from '../config/messages';
import * as path from 'path';

export class FileStorage {
    private static data = null;
    private static filePath = path.resolve(__dirname, '../config/');

    /**
     * This is used for file system storage
     * @param key
     * @param data
     */
    protected static store(key, data) {
        try {
            const stringBuffer = (fs.readFileSync(FileStorage.filePath + '/' + 'file_storage.json')).toString();
            FileStorage.data = JSON.parse(stringBuffer);
            console.log('fileStore =', FileStorage.data);
            FileStorage.data[key] = data;
            console.log('fileStore =', FileStorage.data);
            fs.writeFileSync(FileStorage.filePath + '/' + 'file_storage.json', JSON.stringify(FileStorage.data));
        } catch (e) {
            throw new NotFoundException(e.message);
        }
    }

    /**
     * This is used to store information on file system
     * @param key
     * @returns {any}
     */
    protected static get(key) {
        try {
            const stringBuffer = (fs.readFileSync(FileStorage.filePath + '/' + 'file_storage.json')).toString();
            FileStorage.data = JSON.parse(stringBuffer);
            if (!(FileStorage.data && FileStorage.data[key])) {
                return null;
            } else {
                return FileStorage.data[key];
            }
        } catch (e) {
            throw new NotFoundException(e.message);
        }
    }

    /**
     * This is used to remove key from file system
     * @param key
     * @returns {boolean}
     */
    protected static remove(key) {
        try {
            const stringBuffer = (fs.readFileSync(FileStorage.filePath + '/' + 'file_storage.json')).toString();
            FileStorage.data = JSON.parse(stringBuffer);
            if (!(FileStorage.data && FileStorage.data[key])) {
                throw new NotFoundException(messages.storage.notFound);
            } else {
                FileStorage.data[key] = null;
                console.log('fileStorage=', FileStorage.data);
                fs.writeFileSync(FileStorage.filePath + '/' + 'file_storage.json', JSON.stringify(FileStorage.data));
                return true;
            }
        } catch (e) {
            throw new NotFoundException(e.message);
        }
    }

    /**
     * This is used to empty file storage.
     */
    protected static clear() {
        try {
            fs.writeFileSync(FileStorage.filePath + '/' + 'file_storage.json', JSON.stringify({}));
            return true;
        } catch (e) {
            throw new NotFoundException(e.message);
        }
    }

    /**
     * This is used to reset storage data
     * @param key
     * @param data
     * @returns {boolean}
     */
    protected static reset(key, data?: any) {
        try {
            const stringBuffer = (fs.readFileSync(FileStorage.filePath + '/' + 'file_storage.json')).toString();
            FileStorage.data = JSON.parse(stringBuffer);
            if (!(FileStorage.data && FileStorage.data[key])) {
                throw new NotFoundException(messages.keyNotFound);
            } else {
                FileStorage.data[key] = data || '';
                fs.writeFileSync(FileStorage.filePath + '/' + 'file_storage.json', JSON.stringify(FileStorage.data));
                return true;
            }
        } catch (e) {
            throw new NotFoundException(e.message);
        }
    }
}