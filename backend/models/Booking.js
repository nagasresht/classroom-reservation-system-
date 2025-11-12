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
  // Updated to support multiple slots
  slots: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one slot must be selected'
    }
  },
  // Keep old slot field for backward compatibility (will be deprecated)
  slot: {
    type: String,
    required: false
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
  rejectionReason: String,
  approvedBy: {
    type: String,
    default: null
  },
  approvedByEmail: {
    type: String,
    default: null
  },
  appliedBy: {
    type: String,
    required: false,
    default: null
  },
  appliedByEmail: {
    type: String,
    required: false,
    default: null
  }
}, { timestamps: true });

// Note: Removed unique indexes as they don't work well with arrays
// Validation is now handled in the route logic

module.exports = mongoose.model('Booking', bookingSchema);