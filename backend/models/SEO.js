const mongoose = require('mongoose');

const SEOSchema = new mongoose.Schema({
  page: {
    type: String,
    required: [true, 'Please specify the page identifier'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please add a meta title']
  },
  description: {
    type: String,
    required: [true, 'Please add a meta description']
  },
  keywords: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SEO', SEOSchema);
