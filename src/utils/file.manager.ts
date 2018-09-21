import {BadRequestException} from '@nestjs/common';
import {catchErrors} from './utils';
import * as fs from 'fs';
import {messages} from '../config/messages.conf';
import * as path from 'path';

export class FileManager {
    private static file;
    private static filename;
    private static filePath = path.resolve(__dirname, '../public/uploads/');

    public static store(file, filename: string = null, fileKey?: string): string | BadRequestException {
        FileManager.file = file;
        FileManager.filename = filename;
        return (file.constructor === String) ? FileManager.storeBase64() : FileManager.storeStandard(fileKey);
    }

    /**
     * This is used to store base64 String...
     * @returns {string | BadRequestException}
     */
    private static storeBase64(): string | BadRequestException {
        try {
            const data = JSON.stringify(FileManager.file);
            if (data.indexOf('data:') === -1 || data.indexOf('base64') === -1) {
                throw new BadRequestException(messages.base64);
            }
            const dataSplit = data.split(',');
            const posColon = dataSplit[0].indexOf(':');
            const posSemiColon = dataSplit[0].indexOf(';');
            const ext = (dataSplit[0].substring(posColon, posSemiColon)).split('/')[1];
            console.log('extension=', ext);
            const base64Str = dataSplit[1].trim();
            // console.log({base64Str});
            const buffer = Buffer.from(base64Str, 'base64');
            const filename = (FileManager.filename) ? FileManager.filename : 'file_' + Date.now() + '.' + ext;
            fs.writeFileSync(FileManager.filePath + '/' + filename, buffer);
            return filename;
        } catch (e) {
            throw new BadRequestException(catchErrors.formatError(e));
        }
    }

    /**
     * This is used to store file incoming in formdata.
     * @returns {string}
     */
    private static storeStandard(key): string | BadRequestException {
        try {
            if (!key) {
                throw new BadRequestException(messages.fileKey);
            }
            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            const files = FileManager.file[key];
            const pos = files.name.indexOf('.');
            const ext = files.name.substring(pos + 1);
            const filename = (FileManager.filename) ? FileManager.filename : 'file_' + Date.now() + '.' + ext;
            // Use the mv() method to place the file somewhere on your server
            files.mv(FileManager.filePath + '/' + filename, (err) => {
                if (err) throw new BadRequestException(catchErrors.formatError(err));

                return filename;
            });
            return filename;
        } catch (e) {
            throw new BadRequestException(catchErrors.formatError(e));
        }
    }

    /**
     * This is used to get base64 stream of a file
     * @param filename
     * @returns {string}
     */
    private getBase64(filename): string | BadRequestException {
        try {
            const bitmap = fs.readFileSync(FileManager.filePath + filename);
            return new Buffer(bitmap).toString('base64');
        } catch (e) {
            throw new BadRequestException(catchErrors.formatError(e));
        }
    }
}