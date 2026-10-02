import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'vendor'], default: 'vendor' },
    // Vendors start as "pending". Admin approves or blocks them.
    status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
    shopName: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
