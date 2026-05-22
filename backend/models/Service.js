const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a service description']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  price: {
    type: Number
  },
  minPrice: {
    type: Number,
    required: [true, 'Please add a minimum estimated price'],
    default: 299
  },
  maxPrice: {
    type: Number,
    required: [true, 'Please add a maximum estimated price'],
    default: 499
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: [true, 'Please select a main category']
  },
  subcategory: {
    type: String,
    required: [true, 'Please select a subcategory']
  },
  features: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', ServiceSchema);
