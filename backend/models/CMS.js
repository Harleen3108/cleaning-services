const mongoose = require('mongoose');

const CMSSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Please add a section identifier'],
    unique: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please add section content data']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CMSSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CMS', CMSSchema);
