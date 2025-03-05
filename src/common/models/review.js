import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }
});

productSchema.set('versionKey', false);

export default mongoose.model("Review", reviewSchema);
