const CMS = require('../models/CMS');

// @desc    Get section content
// @route   GET /api/cms/:section
// @access  Public
exports.getSection = async (req, res) => {
  try {
    const cms = await CMS.findOne({ section: req.params.section });
    if (!cms) {
      return res.status(200).json({ success: true, data: null });
    }
    res.status(200).json({ success: true, data: cms.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update section content
// @route   POST /api/cms
// @access  Private/Admin
exports.updateSection = async (req, res) => {
  try {
    const { section, data } = req.body;

    if (!section || !data) {
      return res.status(400).json({ success: false, message: 'Please provide section and data' });
    }

    let cms = await CMS.findOne({ section });

    if (cms) {
      cms.data = data;
      await cms.save();
    } else {
      cms = await CMS.create({ section, data });
    }

    res.status(200).json({ success: true, data: cms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
