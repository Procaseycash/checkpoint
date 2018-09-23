import * as mongoose from 'mongoose';
import * as mongoose_delete from 'mongoose-delete';
import * as mongooseDouble from 'mongoose-double';

mongooseDouble(mongoose);
const Schema = mongoose.Schema;
const WalletSchema = new mongoose.Schema({
        _id: Number,
        wallet_no: Schema.Types.Mixed,
        amount: Schema.Types.Double,
        point: Schema.Types.Double,
        traveller: {type: Number, ref: 'Traveller'},
        currency: Schema.Types.Mixed,
    },
    {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);
WalletSchema.plugin(mongoose_delete, {overrideMethods: true});
WalletSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.deleted;
        delete ret.__v;
    },
});
export default WalletSchema;