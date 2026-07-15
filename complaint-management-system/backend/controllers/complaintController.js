const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Intelligent routing: assign to the active agent with the fewest active complaints
const autoAssignAgent = async () => {
  const agent = await User.findOne({ role: 'AGENT', isActive: true }).sort({ activeComplaintCount: 1 });
  return agent;
};

// @route POST /api/complaints  (USER)
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, attachments } = req.body;

    const agent = await autoAssignAgent();

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      attachments,
      user: req.user._id,
      agent: agent ? agent._id : null,
      status: agent ? 'IN_PROGRESS' : 'OPEN',
    });

    if (agent) {
      agent.activeComplaintCount += 1;
      await agent.save();
    }

    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/complaints  (role-aware listing)
const getComplaints = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'USER') filter.user = req.user._id;
    if (req.user.role === 'AGENT') filter.agent = req.user._id;
    // ADMIN sees everything; optional query filters:
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .populate('agent', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/complaints/:id
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('agent', 'name email')
      .populate('comments.sender', 'name role');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const isOwner = complaint.user._id.toString() === req.user._id.toString();
    const isAssignedAgent = complaint.agent && complaint.agent._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: not your complaint' });
    }

    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/complaints/:id/status  (AGENT/ADMIN)
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolutionNote } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const isAssignedAgent = complaint.agent && complaint.agent.toString() === req.user._id.toString();
    if (req.user.role === 'AGENT' && !isAssignedAgent) {
      return res.status(403).json({ message: 'Forbidden: not assigned to this complaint' });
    }

    const wasOpen = !['RESOLVED', 'CLOSED', 'REJECTED'].includes(complaint.status);
    complaint.status = status || complaint.status;
    if (resolutionNote) complaint.resolutionNote = resolutionNote;

    if (['RESOLVED', 'CLOSED', 'REJECTED'].includes(complaint.status) && wasOpen) {
      complaint.resolvedAt = new Date();
      if (complaint.agent) {
        await User.findByIdAndUpdate(complaint.agent, { $inc: { activeComplaintCount: -1 } });
      }
    }

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/complaints/:id/assign  (ADMIN)
const assignAgent = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const agent = await User.findOne({ _id: agentId, role: 'AGENT' });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    // decrement previous agent's load
    if (complaint.agent) {
      await User.findByIdAndUpdate(complaint.agent, { $inc: { activeComplaintCount: -1 } });
    }

    complaint.agent = agent._id;
    if (complaint.status === 'OPEN') complaint.status = 'IN_PROGRESS';
    await complaint.save();

    agent.activeComplaintCount += 1;
    await agent.save();

    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/complaints/:id/comments  (USER/AGENT/ADMIN - real-time-style chat via polling)
const addComment = async (req, res, next) => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const isOwner = complaint.user.toString() === req.user._id.toString();
    const isAssignedAgent = complaint.agent && complaint.agent.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    complaint.comments.push({
      sender: req.user._id,
      senderRole: req.user.role,
      message,
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/complaints/:id (ADMIN)
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignAgent,
  addComment,
  deleteComplaint,
};
