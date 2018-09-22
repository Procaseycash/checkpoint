
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
const LoginInfoSchema = new Schema({
    _id: Number,
    user: Number,
    type: String,
    status: {type: String, lowercase: false, trim: true},
    ip_address: String,
    ref_token: String,
    browser_agent: String,
    last_login: {type: Date, default: Date.now},
});
LoginInfoSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});
export default LoginInfoSchema;