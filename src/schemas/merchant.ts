import * as mongoose from 'mongoose';
import * as mongoose_delete from 'mongoose-delete';

const MerchantSchema = new mongoose.Schema({
        _id: Number,
        first_name: String,
        last_name: String,
        phone_no: String,
        account_no: String,
        account_name: String,
        bank_code: String,
        bank_name: String,
        email: String,
        merchant_key: String,
    },
    {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);
MerchantSchema.plugin(mongoose_delete, {overrideMethods: true});
MerchantSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.deleted;
        delete ret.__v;
    },
});
export default MerchantSchema;