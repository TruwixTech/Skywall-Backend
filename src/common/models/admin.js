
import mongoose from 'mongoose';
import { SUPERADMIN, SUBADMIN } from '../constants/enum';

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: [SUPERADMIN, SUBADMIN],
        default: SUBADMIN,
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

adminSchema.set('versionKey', false);

export default mongoose.model('Admin', adminSchema);
