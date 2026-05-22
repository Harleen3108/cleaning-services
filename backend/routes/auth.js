const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  getUsers, 
  updateUser, 
  deleteUser, 
  toggleBlockUser, 
  getUserBookings 
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

router.route('/users')
  .get(protect, authorize('admin'), getUsers);

router.route('/users/:id')
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router.route('/users/:id/block')
  .put(protect, authorize('admin'), toggleBlockUser);

router.route('/users/:id/bookings')
  .get(protect, authorize('admin'), getUserBookings);

module.exports = router;
