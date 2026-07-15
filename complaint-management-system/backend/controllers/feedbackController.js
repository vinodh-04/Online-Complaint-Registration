const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

// @route POST /api/feedback  (USER)
const createFeedback = async (req, res, next) => {
  try {
    const { complaintId, rating, comment } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only give feedback on your own complaints' });
    }

    if (!['RESOLVED', 'CLOSED'].includes(complaint.status)) {
      return res.status(400).json({ message: 'Feedback is only allowed after resolution' });
    }

    const existing = await Feedback.findOne({ complaint: complaintId });
    if (existing) return res.status(400).json({ message: 'Feedback already submitted for this complaint' });

    const feedback = await Feedback.create({
      complaint: complaintId,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/feedback  (ADMIN) - all feedback, or AGENT sees feedback for their complaints
const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find()
      .populate({ path: 'complaint', select: 'title agent' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

module.exports = { createFeedback, getFeedback };
