const Settings = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    
    // Map list to key-value format for easier frontend handling
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single settings group (Public keys etc)
// @route   GET /api/settings/public
// @access  Public
exports.getPublicSettings = async (req, res) => {
  try {
    const businessInfo = await Settings.findOne({ key: 'business_info' });
    const modules = await Settings.findOne({ key: 'features' });

    res.status(200).json({
      success: true,
      data: {
        business_info: businessInfo ? businessInfo.value : null,
        features: modules ? modules.value : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update setting
// @route   POST /api/settings
// @access  Private/Admin
exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide settings key and value' });
    }

    let setting = await Settings.findOne({ key });

    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await Settings.create({ key, value });
    }

    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
