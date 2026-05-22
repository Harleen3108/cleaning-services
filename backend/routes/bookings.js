const express = require('express');
const {
  getMyBookings,
  getAllBookings,
  createBooking,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: anyone can submit a service booking (no login required)
router.post('/', createBooking);

// Protected: only logged-in users can view their own bookings
router.get('/', protect, getMyBookings);

// Admin only routes
router.get('/admin', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;
