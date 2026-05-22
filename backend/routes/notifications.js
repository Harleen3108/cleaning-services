const express = require('express');
const { getMyNotifications, createNotification, markAsRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getMyNotifications)
  .post(protect, authorize('admin'), createNotification);

router.route('/:id/read')
  .put(protect, markAsRead);

module.exports = router;
