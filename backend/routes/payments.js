const express = require('express');
const { getPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getPayments);

module.exports = router;
