import * as mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
        _id: {type: String, required: true},
        seq: {type: Number, default: 0},
    },
);

CounterSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});
export default CounterSchema;