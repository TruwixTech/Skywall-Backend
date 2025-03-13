
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { USER, PRODUCT, PENDING, COMPLETED, CANCELLED, SHIPPED, DELIVERED } from '../constants/enum';
const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: USER
    },
    products: [
        {
            product_id: {
                type: Schema.Types.ObjectId,
                ref: PRODUCT
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            warranty_expiry_date: {
                type: Date
            },
            extended_warranty: {
                type: Number
            },
            total_warranty: {
                type: Number
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: [0, "Total price cannot be negative"],
    },
    shippingAddress: {
        type: String,
    },
    shippingCost: {
        type: Number
    },
    email: {
        type: String
    },
    pincode: {
        type: String,
        required: true,
        maxlength: 6,
        minlength: 6
    },
    name: {
        type: String,
    },
    city: {
        type: String
    },
    expectedDelivery: {
        type: Date,
    },
    status: {
        type: String,
        enum: [PENDING, SHIPPED, DELIVERED, CANCELLED],
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
