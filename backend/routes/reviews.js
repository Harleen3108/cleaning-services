const express = require('express');
const {
  getApprovedReviews,
  getAllReviews,
  createReview,
  updateReviewStatus
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getApprovedReviews)
  .post(protect, createReview);

router.route('/admin')
  .get(protect, authorize('admin'), getAllReviews);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateReviewStatus);

module.exports = router;
