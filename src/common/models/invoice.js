
import mongoose from 'mongoose';
import { INR, ORDER, PAID, PAYMENT, UNPAID, USER } from '../constants/enum';
const Schema = mongoose.Schema;

const itemSchema = new Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: Number,
        warranty_expiry_date: {
            type: Date,
            default: null,
        },
        extendedWarrantyDuration: {
            type: Number,
            default: 0,
        },
        totalWarranty: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const invoiceSchema = new Schema({
    invoiceNumber: { type: String, unique: true },
    order_Id: { type: mongoose.Schema.Types.ObjectId, ref: ORDER, required: true },
    user_Id: { type: mongoose.Schema.Types.ObjectId, ref: USER, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: INR },
    items: [
        itemSchema,
    ],
    status: { type: String, enum: [PAID, UNPAID], default: PAID },
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

invoiceSchema.set('versionKey', false);

export default mongoose.model('Invoice', invoiceSchema);
