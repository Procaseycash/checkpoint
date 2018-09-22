import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
const CheckInLogSchema = new Schema({
    _id: Number,
    consumer: {type: Number, ref: 'Consumer'},
    origin: String,
    destination: String,
    kilometer: String,
    point: String,
    amount: String,
    status: String,
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

CheckInLogSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});
export default CheckInLogSchema;