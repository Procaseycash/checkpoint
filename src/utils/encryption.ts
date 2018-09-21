import JsEncrypt from './jsencrypt.js';
import * as path from 'path';
import * as fs from 'fs';

const filePath = path.resolve(__dirname, '../config/rsa-keys/');
const privateKey = fs.readFileSync(filePath + '/' + 'privateKey.pem').toString();
const publicKey = fs.readFileSync(filePath + '/' + 'publicKey.pem').toString();
export const encryption = {
    encode(data) {
        const letEncrypt = new JsEncrypt();
        letEncrypt.setPublicKey(publicKey);
        return letEncrypt.encrypt(JSON.stringify(data));
    },
    decode(data) {
        const letEncrypt = new JsEncrypt();
        letEncrypt.setPrivateKey(privateKey);
        const result = letEncrypt.decrypt(data);
        return (result && result.indexOf('{') > -1 && result.lastIndexOf('}') > -1) ? JSON.parse(result) : result;
    },
};
