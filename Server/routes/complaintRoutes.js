const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createComplaint, getUserComplaints } = require('../controllers/complaintController');

// @route   POST api/complaints
router.post('/', auth, createComplaint);

// @route   GET api/complaints
router.get('/', auth, getUserComplaints);

module.exports = router;