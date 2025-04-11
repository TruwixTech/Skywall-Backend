
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const zipcodeSchema = new Schema({
    zipcode:{
        type: Number,
        required: true
    },
    dispatchCenter:{
        type: String,
        required: true
    },
    originCenter:{
        type: String,
        required: true
    },
    returnCenter:{
        type: String,
        required: true
    },
    facilityCity:{
        type: String,
        required: true
    },
    outOfDeliveryArea:{
        type: Boolean,
        required: true
    },
    facilityState:{
        type: String,
        required: true
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

zipcodeSchema.set('versionKey', false);

export default mongoose.model('Zipcode', zipcodeSchema);
