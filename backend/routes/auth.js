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
  const bad = (field, message, code = 400) => res.status(code).json({ field, message });
  if (!name?.trim()) return bad('name', 'Please enter your full name');
  if (!shopName?.trim()) return bad('shopName', 'Please enter your shop name');
  if (!/^\S+@\S+\.\S+$/.test(email || '')) return bad('email', 'Enter a valid email, like name@example.com');
  if (!password || password.length < 6) return bad('password', 'Password must be at least 6 characters');
  if (await User.findOne({ email: email.toLowerCase() })) return bad('email', 'An account with this email already exists. Try logging in.', 409);

  const user = await User.create({ name, email, shopName, password: await bcrypt.hash(password, 10), role: 'vendor' });
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ field: 'email', message: 'Please enter your email address' });
  if (!password) return res.status(400).json({ field: 'password', message: 'Please enter your password' });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ field: 'email', message: 'No account found with this email. Please sign up first.' });
  if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ field: 'password', message: 'Incorrect password. Please try again.' });
  if (user.status === 'blocked') return res.status(403).json({ message: 'Your account is blocked. Please contact support.' });
  res.json({ token: makeToken(user), user: publicUser(user) });
});

// Used by the frontend to refresh the user (for example after admin approval)
router.get('/me', protect, (req, res) => res.json(publicUser(req.user)));

export default router;
