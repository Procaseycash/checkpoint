import * as mongoose from 'mongoose';
import * as mongoose_delete from 'mongoose-delete';

const UserSchema = new mongoose.Schema({
        _id: Number,
        first_name: String,
        last_name: String,
        phone_no: String,
        email: String,
        password: String,
        address: String,
        company: String,
        type: {type: String, lowercase: false, trim: true},
    },
    {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);
UserSchema.plugin(mongoose_delete,  { overrideMethods: true });
UserSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});
export default UserSchema;