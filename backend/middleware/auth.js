import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Step 1: check the token and find the user
export const protect = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Please log in first' });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.status === 'blocked') return res.status(403).json({ message: 'Your account is blocked' });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again' });
  }
};

// Step 2: allow only some roles, e.g. allow('admin')
export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have access' });
