
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const specificationSchema = new Schema({
    title: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: String, required: true },
  });

const productSchema = new Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    discount_percentage:{
        type:Number
    },
    new_price:{
        type:Number
    },
    warranty_pricing: {
        type: Map,
        of: Number,
        default: { "1": 1000, "2": 1500, "3": 2000 }
    },
    stock:{
        type:Number
    },
    warranty_years:{
        type:Number
    },
    highlights:{
        type:[String],
        default:[]
    },
    specificationSchema:{
        type:[specificationSchema],
        default:[]
    },
    image:{
        type:[String],
        default:[]
    },
    description:{
        type:String
    },
    category:{
        type:String
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

productSchema.set('versionKey', false);

export default mongoose.model('Product', productSchema);
