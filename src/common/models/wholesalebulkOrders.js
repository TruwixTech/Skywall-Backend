
import mongoose from 'mongoose';
import { PAYMENT_COMPLETED, PAYMENT_PENDING } from '../constants/enum';
const Schema = mongoose.Schema;

const wholesalebulkOrdersSchema = new Schema({
    products: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    total_price: { type: Number, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    shipping_address: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        fullAddress: { type: String, required: true },
        apartment: String,
        city: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    billing_address: {
        billingFirstName: { type: String, required: true },
        billingLastName: { type: String, required: true },
        billingFullAddress: { type: String, required: true },
        billingApartment: String,
        billingCity: { type: String, required: true },
        billingCountry: { type: String, required: true },
        billingState: { type: String, required: true },
        billingZipCode: { type: String, required: true }
    },
    paymentStatus: {
        type: String,
        enum: [PAYMENT_PENDING, PAYMENT_COMPLETED],
        default: PAYMENT_PENDING
    },
    companyName: {
        type: String,
    },
    gstNumber: {
        type: String
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

wholesalebulkOrdersSchema.set('versionKey', false);

export default mongoose.model('Wholesalebulk Orders', wholesalebulkOrdersSchema);
