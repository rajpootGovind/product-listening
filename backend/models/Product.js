import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true, default: 'General' },
    image: { type: String, trim: true, default: '' },
    stock: { type: Number, default: 0, min: 0 },
    // Admin can hide a product from the public shop
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
