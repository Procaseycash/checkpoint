import * as mongoose from 'mongoose';
import * as mongoose_delete from 'mongoose-delete';
import * as mongooseDouble from 'mongoose-double';

mongooseDouble(mongoose);
const Schema = mongoose.Schema;
const TransactionSchema = new mongoose.Schema({
        _id: Number,
        consumer: {type: Number, ref: 'Consumer'},
        merchant:  {type: Number, ref: 'Merchant'},
        amount: Schema.Types.Double,
        item_name: String,
        item_code: String,
        status: String,
        transaction_reference: String,
    },
    {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);
TransactionSchema.plugin(mongoose_delete, {overrideMethods: true});
TransactionSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.deleted;
        delete ret.__v;
    },
});
export default TransactionSchema;