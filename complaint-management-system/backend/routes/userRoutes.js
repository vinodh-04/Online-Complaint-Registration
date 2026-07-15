const express = require('express');
const { body } = require('express-validator');
const { getUsers, createUser, updateUser, deleteUser, getStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/', getUsers);
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  createUser
);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
