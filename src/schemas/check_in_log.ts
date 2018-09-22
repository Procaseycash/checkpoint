import * as mongoose from 'mongoose';
import * as mongooseDouble from 'mongoose-double';

mongooseDouble(mongoose);
const Schema = mongoose.Schema;
const CheckInLogSchema = new Schema({
    _id: Number,
    traveller: {type: Number, ref: 'Traveller'},
    user_origin_location: String,
    gps_origin_location: String,
    user_destination_location: String,
    gps_destination_location: String,
    currency: Schema.Types.Mixed,
    kilometer: String,
    total_time: String,
    point: Schema.Types.Double,
    amount: Schema.Types.Double,
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