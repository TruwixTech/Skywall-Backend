
import mongoose from 'mongoose';
import { PENDING,RESOLVED,IN_PROGRESS } from '../constants/enum';
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
        enum:[PENDING,IN_PROGRESS,RESOLVED],
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
