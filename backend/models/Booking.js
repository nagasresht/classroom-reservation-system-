const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  facultyName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  staffNumber: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  rejectionReason: String
}, { timestamps: true });

// Compound index to prevent duplicate approved bookings
bookingSchema.index(
  { room: 1, date: 1, slot: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'Approved' } }
);

// Index to prevent duplicate pending requests from same faculty
bookingSchema.index(
  { room: 1, date: 1, slot: 1, facultyName: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'Pending' } }
);

module.exports = mongoose.model('Booking', bookingSchema);