import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SearchHistorySchema = new Schema({
    _id: Number,
    user: {type: Number, ref: 'User'},
    result: Schema.Types.Mixed,
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

SearchHistorySchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});
export default SearchHistorySchema;