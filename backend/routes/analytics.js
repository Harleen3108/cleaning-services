const express = require('express');
const { trackVisit, getDashboardStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/track', trackVisit);
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);

module.exports = router;
