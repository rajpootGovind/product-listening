import { Router } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, allow } from '../middleware/auth.js';

const router = Router();
router.use(protect, allow('admin')); // every route here is admin only

router.get('/stats', async (req, res) => {
  const [vendors, pending, products, active] = await Promise.all([
    User.countDocuments({ role: 'vendor' }),
    User.countDocuments({ role: 'vendor', status: 'pending' }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
  ]);
  res.json({ vendors, pending, products, active });
});

router.get('/vendors', async (req, res) => {
  const vendors = await User.find({ role: 'vendor' }).select('-password').sort('-createdAt').lean();
  const counts = await Product.aggregate([{ $group: { _id: '$vendor', n: { $sum: 1 } } }]);
  const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json(vendors.map((v) => ({ ...v, productCount: countMap[String(v._id)] || 0 })));
});

router.patch('/vendors/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'blocked'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const vendor = await User.findOneAndUpdate({ _id: req.params.id, role: 'vendor' }, { status }, { new: true }).select('-password');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  res.json(vendor);
});

router.delete('/vendors/:id', async (req, res) => {
  await Product.deleteMany({ vendor: req.params.id });
  await User.deleteOne({ _id: req.params.id, role: 'vendor' });
  res.json({ message: 'Vendor and their products deleted' });
});

router.get('/products', async (req, res) => {
  res.json(await Product.find().populate('vendor', 'shopName name').sort('-createdAt'));
});

router.patch('/products/:id/toggle', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  product.isActive = !product.isActive;
  await product.save();
  res.json(product);
});

router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

export default router;
