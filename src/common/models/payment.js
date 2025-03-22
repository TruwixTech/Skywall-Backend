
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {
    USER,
    PAYMENT_PENDING,
    PAYMENT_COMPLETED,
    PAYMENT_FAILED,
    INR,
    PAY_ONLINE,
    CASH_ON_DELIVERY,
    PAYMENT,
    ORDER,
    PAYMENT_REFUNDED
} from "../constants/enum";

const paymentSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: ORDER,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    payment_method: {
        type: String,
        enum: [PAY_ONLINE, CASH_ON_DELIVERY],
        default: PAY_ONLINE
    },
    currency: {
        type: String,
        default: INR,
    },
    status: {
        type: String,
        enum: [PAYMENT_PENDING, PAYMENT_COMPLETED, PAYMENT_FAILED, PAYMENT_REFUNDED],
        default: PAYMENT_PENDING,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: USER,
        required: true,
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

paymentSchema.set('versionKey', false);

export default mongoose.model(PAYMENT, paymentSchema);
