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
const vendor = await makeUser({ name: 'Demo Vendor', email: 'vendor@manstack.com', password: 'Vendor@123', role: 'vendor', status: 'approved', shopName: 'Agra Craft House' });

if ((await Product.countDocuments({ vendor: vendor._id })) === 0) {
  const img = (w) => `https://picsum.photos/seed/${w}/640/480`;
  await Product.insertMany([
    { title: 'Marble Inlay Coaster Set', description: 'Hand-cut inlay work, set of four.', price: 1299, category: 'Home Decor', stock: 24, image: img('marble') },
    { title: 'Leather Journal', description: 'Stitched cover with 200 cream pages.', price: 799, category: 'Stationery', stock: 40, image: img('journal') },
    { title: 'Brass Diya Lamp', description: 'Polished brass lamp for festive evenings.', price: 549, category: 'Home Decor', stock: 60, image: img('lamp') },
    { title: 'Block Print Cotton Kurta', description: 'Soft cotton with natural dye prints.', price: 1899, category: 'Fashion', stock: 15, image: img('kurta') },
    { title: 'Ceramic Coffee Mug', description: 'Glazed mug, 350 ml, dishwasher safe.', price: 399, category: 'Kitchen', stock: 80, image: img('mug') },
    { title: 'Jute Tote Bag', description: 'Strong everyday bag with inner pocket.', price: 649, category: 'Fashion', stock: 0, image: img('tote') },
  ].map((p) => ({ ...p, vendor: vendor._id })));
}

console.log('Seed done.\nAdmin  ->', process.env.ADMIN_EMAIL, '/', process.env.ADMIN_PASSWORD, '\nVendor -> vendor@manstack.com / Vendor@123');
process.exit(0);
