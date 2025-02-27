
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    discount:{
        type:Number
    },
    warranty:{
        type:Number
    },
    image:{
        type:String
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
