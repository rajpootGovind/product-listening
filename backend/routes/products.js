import { Router } from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, allow } from '../middleware/auth.js';

const router = Router();

// PUBLIC: all visible products (active product + approved vendor)
router.get('/', async (req, res) => {
  const vendors = await User.find({ role: 'vendor', status: 'approved' }).select('_id');
  const products = await Product.find({ isActive: true, vendor: { $in: vendors.map((v) => v._id) } })
    .populate('vendor', 'shopName')
    .sort('-createdAt');
  res.json(products);
});

// Everything below is for logged-in vendors only
router.use(protect, allow('vendor'));

router.get('/mine', async (req, res) => {
  res.json(await Product.find({ vendor: req.user._id }).sort('-createdAt'));
});

// Only approved vendors can add products
const mustBeApproved = (req, res, next) =>
  req.user.status === 'approved' ? next() : res.status(403).json({ message: 'Your shop is waiting for admin approval' });

const pick = ({ title, description, price, category, image, stock }) => ({ title, description, price, category, image, stock });

router.post('/', mustBeApproved, async (req, res) => {
  if (!req.body.title || req.body.price === '' || req.body.price == null) {
    return res.status(400).json({ message: 'Title and price are required' });
  }
  const product = await Product.create({ ...pick(req.body), vendor: req.user._id });
  res.status(201).json(product);
});

router.put('/:id', mustBeApproved, async (req, res) => {
  // The filter makes sure a vendor can edit only their own product
  const product = await Product.findOneAndUpdate({ _id: req.params.id, vendor: req.user._id }, pick(req.body), { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.delete('/:id', async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

export default router;
