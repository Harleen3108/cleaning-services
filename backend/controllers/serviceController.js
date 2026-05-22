const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    const services = await Service.find(query).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    // If features comes as a string (from form-data), parse it
    let features = req.body.features;
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = features.split(',').map(f => f.trim());
      }
    }

    const serviceData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.minPrice || req.body.price || 299), // Keep price for backwards compatibility
      minPrice: Number(req.body.minPrice || req.body.price || 299),
      maxPrice: Number(req.body.maxPrice || 499),
      isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : true,
      category: req.body.category,
      subcategory: req.body.subcategory,
      features: features || []
    };

    if (req.file) {
      serviceData.image = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      serviceData.image = req.body.image;
    }

    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    let features = req.body.features;
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = features.split(',').map(f => f.trim());
      }
    }

    const serviceData = {
      name: req.body.name !== undefined ? req.body.name : service.name,
      description: req.body.description !== undefined ? req.body.description : service.description,
      minPrice: req.body.minPrice !== undefined ? Number(req.body.minPrice) : service.minPrice,
      maxPrice: req.body.maxPrice !== undefined ? Number(req.body.maxPrice) : service.maxPrice,
      price: req.body.minPrice !== undefined ? Number(req.body.minPrice) : service.price,
      isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : service.isActive,
      category: req.body.category !== undefined ? req.body.category : service.category,
      subcategory: req.body.subcategory !== undefined ? req.body.subcategory : service.subcategory,
      features: features !== undefined ? features : service.features
    };

    if (req.file) {
      serviceData.image = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      serviceData.image = req.body.image;
    }

    service = await Service.findByIdAndUpdate(req.params.id, serviceData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
