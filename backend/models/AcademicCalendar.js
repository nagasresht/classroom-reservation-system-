const mongoose = require('mongoose');

const academicCalendarSchema = new mongoose.Schema({
  branch: String, // CSE or CSBS
  year: String,
  section: String,
  day: String,
  slot: String,
  type: String,
  subject: String,
  room: String,
  faculty: String // 👈 NEW FIELD ADDED
}, {
  timestamps: true
});

module.exports = mongoose.model('AcademicCalendar', academicCalendarSchema);
