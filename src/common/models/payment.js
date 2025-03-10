import mongoose from "mongoose";
const Schema = mongoose.Schema;

import {
  USER,
  PAYMENT_PENDING,
  PAYMENT_COMPLETED,
  PAYMENT_FAILED,
  INR,
  PAY_ONLINE,
  CASH_ON_DELIVERY
} from "../constants/enum";

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    payment_method:{
      type:String,
      enum:[PAY_ONLINE,CASH_ON_DELIVERY],
      default:PAY_ONLINE
    },
    currency: {
      type: String,
      default: INR,
    },
    status: {
      type: String,
      enum: [PAYMENT_PENDING, PAYMENT_COMPLETED, PAYMENT_FAILED],
      default: PAYMENT_PENDING,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);


