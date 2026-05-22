const express = require('express');
const { getSettings, getPublicSettings, updateSetting } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getSettings)
  .post(protect, authorize('admin'), updateSetting);

router.route('/public')
  .get(getPublicSettings);

module.exports = router;
