import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
          quantity: {
            type: Number,
            required: true,
            default: 1,
          }
        },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

cartSchema.set('versionKey', false);

export default mongoose.model('Cart', cartSchema);