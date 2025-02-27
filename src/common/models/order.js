
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { PENDING,COMPLETED,CANCELLED } from '../constants/enum';
const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number
    },
    total_price: {
        type: Number
    },
    status: {
        type: String,
        enum: [PENDING,COMPLETED,CANCELLED],
        default: PENDING
    },
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
