const mongoose = require('mongoose');

const sectionRoomSchema = new mongoose.Schema({
  year: { type: String, required: true },
  section: { type: String, required: true },
  room: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Unique index to ensure one room per year-section combination
sectionRoomSchema.index({ year: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('SectionRoom', sectionRoomSchema);
