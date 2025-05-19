// backend/models/ClassroomMap.js
const mongoose = require('mongoose');

const classroomMapSchema = new mongoose.Schema({
  year: { type: String, required: true },
  section: { type: String, required: true },
  room: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

classroomMapSchema.index({ year: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('ClassroomMap', classroomMapSchema);
