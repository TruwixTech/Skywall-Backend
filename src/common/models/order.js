
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    is_deleted: {
        type: Boolean,
        default: false 
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

orderSchema.set('versionKey', false);

export default mongoose.model('Order', orderSchema);
