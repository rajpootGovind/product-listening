// Run once: npm run seed
// Creates 1 admin, 1 approved demo vendor and a few products.
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';

await mongoose.connect(process.env.MONGO_URI);

const makeUser = async (data) =>
  (await User.findOne({ email: data.email })) ||
  User.create({ ...data, password: await bcrypt.hash(data.password, 10) });

await makeUser({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin', status: 'approved' });
const vendor = await makeUser({ name: 'Demo Vendor2', email: 'vendor2@manstack.com', password: 'Vendor@123', role: 'vendor', status: 'approved', shopName: 'Agra Craft House' });

if ((await Product.countDocuments({ vendor: vendor._id })) === 0) {
  const img = (w) => `https://picsum.photos/seed/${w}/640/480`;
  await Product.insertMany([
  {
    title: 'Marble Inlay Coaster Set',
    description: 'Handcrafted marble coasters with elegant floral inlay work. Set of four.',
    price: 1299,
    category: 'Home Decor',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Premium Leather Journal',
    description: 'Hand-stitched vintage-style leather notebook with 200 cream pages.',
    price: 799,
    category: 'Stationery',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Traditional Brass Diya',
    description: 'Beautiful polished brass oil lamp, ideal for festive decorations and pooja.',
    price: 549,
    category: 'Home Decor',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Block Print Cotton Kurta',
    description: 'Lightweight breathable cotton kurta featuring traditional Indian block prints.',
    price: 1899,
    category: 'Fashion',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Minimal Ceramic Coffee Mug',
    description: 'Hand-glazed ceramic coffee mug with a minimalist design. Capacity 350 ml.',
    price: 399,
    category: 'Kitchen',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Eco-Friendly Jute Tote Bag',
    description: 'Reusable natural jute shopping tote with reinforced handles and inner pocket.',
    price: 649,
    category: 'Fashion',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
  },
].map((p) => ({ ...p, vendor: vendor._id })));
}

console.log('Seed done.\nAdmin  ->', process.env.ADMIN_EMAIL, '/', process.env.ADMIN_PASSWORD, '\nVendor -> vendor@manstack.com / Vendor@123');
process.exit(0);
