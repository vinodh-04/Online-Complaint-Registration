const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignAgent,
  addComment,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('USER'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  validate,
  createComplaint
);

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.put('/:id/status', authorize('AGENT', 'ADMIN'), updateComplaintStatus);
router.put('/:id/assign', authorize('ADMIN'), assignAgent);
router.post('/:id/comments', body('message').trim().notEmpty(), validate, addComment);
router.delete('/:id', authorize('ADMIN'), deleteComplaint);

module.exports = router;
