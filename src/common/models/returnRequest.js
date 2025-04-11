
import mongoose from 'mongoose';
import { ORDER, PAYMENT, USER } from '../constants/enum';
const Schema = mongoose.Schema;

const returnRequestSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: USER, required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: ORDER, required: true },
    return_reason: { type: String, required: true },
    status: { type: Boolean, required: true, default: false },
    refund_amount: { type: Number, required: true },
    refund_status: { type: Boolean, required: true, default: false },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: PAYMENT, required: true },
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

returnRequestSchema.set('versionKey', false);

export default mongoose.model('Return Request', returnRequestSchema);
