import * as mongoose from 'mongoose';
import * as mongoose_delete from 'mongoose-delete';

const ConsumerSchema = new mongoose.Schema({
        _id: Number,
        first_name: String,
        last_name: String,
        phone_no: String,
        email: String,
    },
    {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);
ConsumerSchema.plugin(mongoose_delete,  { overrideMethods: true });
ConsumerSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.deleted;
        delete ret.__v;
    },
});
export default ConsumerSchema;