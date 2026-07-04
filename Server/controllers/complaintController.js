const Complaint = require('../models/Complaint');

// Create a new complaint
exports.createComplaint = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newComplaint = new Complaint({
            user: req.user.id,
            title,
            description
        });
        await newComplaint.save();
        res.status(201).json(newComplaint);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all complaints for logged-in user
exports.getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};