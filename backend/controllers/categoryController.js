const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;

    let subList = [];
    if (subcategories) {
      if (typeof subcategories === 'string') {
        subList = subcategories.split(',').map(s => ({ name: s.trim(), isActive: true }));
      } else if (Array.isArray(subcategories)) {
        subList = subcategories.map(s => typeof s === 'string' ? { name: s, isActive: true } : s);
      }
    }

    const categoryData = {
      name,
      subcategories: subList
    };

    if (req.file) {
      categoryData.image = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      categoryData.image = req.body.image;
    }

    const category = await Category.create(categoryData);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, subcategories, isActive } = req.body;

    let updateData = {};
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (subcategories !== undefined) {
      let subList = [];
      if (typeof subcategories === 'string') {
        subList = subcategories.split(',').map(s => ({ name: s.trim(), isActive: true }));
      } else if (Array.isArray(subcategories)) {
        subList = subcategories.map(s => typeof s === 'string' ? { name: s, isActive: true } : s);
      }
      updateData.subcategories = subList;
    }

    if (req.file) {
      updateData.image = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
