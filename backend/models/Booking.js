const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a contact name']
  },
  email: {
    type: String,
    required: [true, 'Please add a contact email']
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact phone number']
  },
  description: {
    type: String,
    required: [true, 'Please describe your request details']
  },
  dateTime: {
    type: Date,
    required: [true, 'Please add a booking date and time']
  },
  latitude: {
    type: Number,
    required: [true, 'Please pin your location on the map']
  },
  longitude: {
    type: Number,
    required: [true, 'Please pin your location on the map']
  },
  formattedAddress: {
    type: String,
    required: [true, 'Please specify your formatted map address']
  },
  customization: {
    extraRooms: { type: Number, default: 0 },
    hasBalcony: { type: Boolean, default: false },
    notes: { type: String, default: '' }
  },
  staff: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Disapproved', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  statusReason: {
    type: String,
    default: ''
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
