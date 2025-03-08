import mongoose from "mongoose";
const Schema = mongoose.Schema;
const {
  USER,
  PAYMENT_PENDING,
  PAYMENT_COMPLETED,
  PAYMENT_FAILED,
  INR,
} = require("../utils/enum");

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: INR,
    },
    status: {
      type: String,
      enum: [PAYMENT_PENDING, PAYMENT_COMPLETED, PAYMENT_FAILED],
      default: PAYMENT_PENDING,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER, // Assuming there is a User model
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
