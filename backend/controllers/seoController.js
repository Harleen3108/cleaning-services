const SEO = require('../models/SEO');

// @desc    Get SEO settings for a page
// @route   GET /api/seo/:page
// @access  Public
exports.getSEOSettings = async (req, res) => {
  try {
    const page = req.params.page.toLowerCase();
    let seo = await SEO.findOne({ page });
    
    // If not found, return default tags so it doesn't break
    if (!seo) {
      seo = {
        page,
        title: 'Cleannes | Professional Home Cleaning Services',
        description: 'Premium home and office cleaning, pest control, carpet cleaning services. Contact us today!',
        keywords: 'cleaning, deep cleaning, pest control, sofa cleaning'
      };
    }

    res.status(200).json({ success: true, data: seo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update/Create SEO settings for a page
// @route   POST /api/seo
// @access  Private/Admin
exports.updateSEOSettings = async (req, res) => {
  try {
    const { page, title, description, keywords } = req.body;

    let seo = await SEO.findOne({ page: page.toLowerCase() });

    if (seo) {
      seo.title = title;
      seo.description = description;
      seo.keywords = keywords;
      await seo.save();
    } else {
      seo = await SEO.create({
        page: page.toLowerCase(),
        title,
        description,
        keywords
      });
    }

    res.status(200).json({ success: true, data: seo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
