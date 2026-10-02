import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const makeToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, status: u.status, shopName: u.shopName });

// Vendor sign up (admins are created by the seed script)
router.post('/register', async (req, res) => {
  const { name, email, password, shopName } = req.body;
  if (!name || !email || !password || !shopName) return res.status(400).json({ message: 'Please fill all fields' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'This email is already used' });

  const user = await User.create({ name, email, shopName, password: await bcrypt.hash(password, 10), role: 'vendor' });
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return res.status(400).json({ message: 'Wrong email or password' });
  }
  if (user.status === 'blocked') return res.status(403).json({ message: 'Your account is blocked' });
  res.json({ token: makeToken(user), user: publicUser(user) });
});

// Used by the frontend to refresh the user (for example after admin approval)
router.get('/me', protect, (req, res) => res.json(publicUser(req.user)));

export default router;
