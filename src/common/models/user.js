
import mongoose from 'mongoose';
import { ADMIN, USER } from '../constants/enum';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number,
        unique: true
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    role: {
        type: String,
        enum: [ADMIN, USER],
        default: USER
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

userSchema.set('versionKey', false);

export default mongoose.model('User', userSchema);
