
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const wholesaleProductsSchema = new Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    priceBreaks: [
        {
            minQuantity: { type: Number, required: true }, 
            maxQuantity: { type: Number },
            discount: { type: Number, required: true }
        }
    ],
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

wholesaleProductsSchema.set('versionKey', false);

export default mongoose.model('WholesaleProducts', wholesaleProductsSchema);
