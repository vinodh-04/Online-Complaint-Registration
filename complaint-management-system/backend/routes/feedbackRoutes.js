const express = require('express');
const { body } = require('express-validator');
const { createFeedback, getFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('USER'),
  [
    body('complaintId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
  ],
  validate,
  createFeedback
);

router.get('/', authorize('ADMIN'), getFeedback);

module.exports = router;
