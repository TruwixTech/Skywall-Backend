
import mongoose from 'mongoose';
import { USER,PRODUCT,PENDING,COMPLETED,CANCELLED } from '../constants/enum';
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
        },
    phone: {
        type: String,
        required: true
    },
    issue_type:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:[PENDING,COMPLETED,CANCELLED],
        default:PENDING
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

complaintSchema.set('versionKey', false);

export default mongoose.model('Complaint', complaintSchema);
