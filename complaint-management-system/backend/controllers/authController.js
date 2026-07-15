const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @route POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Only allow ADMIN to create AGENT/ADMIN accounts through a separate route.
    // Public registration is always a plain USER.
    const user = await User.create({ name, email, password, phone, role: 'USER' });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated' });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getMe };
