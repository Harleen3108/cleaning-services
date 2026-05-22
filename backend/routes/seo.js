const express = require('express');
const { getSEOSettings, updateSEOSettings } = require('../controllers/seoController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:page', getSEOSettings);
router.post('/', protect, authorize('admin'), updateSEOSettings);

module.exports = router;
