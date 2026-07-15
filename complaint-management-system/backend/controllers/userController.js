const User = require('../models/User');
const Complaint = require('../models/Complaint');

// @route GET /api/users  (ADMIN) - list users, optional ?role=AGENT
const getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/users  (ADMIN) - create an AGENT or ADMIN account
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: ['AGENT', 'ADMIN', 'USER'].includes(role) ? role : 'AGENT',
    });

    res.status(201).json(user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/:id  (ADMIN) - activate/deactivate, change role
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive, name, phone } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    res.json(user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/users/:id  (ADMIN)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/stats  (ADMIN) - analytics dashboard data
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalAgents, totalComplaints, statusCounts, categoryCounts] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'AGENT' }),
      Complaint.countDocuments(),
      Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);

    const resolved = await Complaint.find({ resolvedAt: { $ne: null } }).select('createdAt resolvedAt');
    const avgResolutionHours =
      resolved.length > 0
        ? resolved.reduce((sum, c) => sum + (c.resolvedAt - c.createdAt) / 36e5, 0) / resolved.length
        : 0;

    res.json({
      totalUsers,
      totalAgents,
      totalComplaints,
      statusCounts,
      categoryCounts,
      avgResolutionHours: Math.round(avgResolutionHours * 100) / 100,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getStats };
