const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Email of the user
  message: { type: String, required: true },
  type: { type: String, enum: ['approved', 'rejected', 'info'], default: 'info' },
  bookingDetails: {
    room: String,
    date: String,
    slot: String,
    reason: String
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
