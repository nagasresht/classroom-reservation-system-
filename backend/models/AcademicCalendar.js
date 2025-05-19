const mongoose = require('mongoose');

const academicCalendarSchema = new mongoose.Schema({
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
