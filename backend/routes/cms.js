const express = require('express');
const { getSection, updateSection } = require('../controllers/cmsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), updateSection);

router.route('/:section')
  .get(getSection);

module.exports = router;
