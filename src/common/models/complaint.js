
import mongoose from 'mongoose';
import { PENDING, RESOLVED, IN_PROGRESS, USER } from '../constants/enum';
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: USER
    },
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
    issue_type: {
        type: String
    },
    description: {
        type: String
    },
    customIssueType: {
        type: String
    },
    status: {
        type: String,
        enum: [PENDING, IN_PROGRESS, RESOLVED],
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

complaintSchema.set('versionKey', false);

export default mongoose.model('Complaint', complaintSchema);
