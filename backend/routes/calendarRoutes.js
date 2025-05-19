const express = require('express');
const router = express.Router();
const AcademicCalendar = require('../models/AcademicCalendar');
const ClassroomMap = require('../models/ClassroomMap');

// 1. Save timetable entries (bulk insert)
router.post('/bulk', async (req, res) => {
  const { entries } = req.body;
  if (!entries || !Array.isArray(entries)) {
    return res.status(400).json({ message: 'Entries must be an array' });
  }

  try {
    const sanitized = entries.map(entry => ({
      year: entry.year,
      section: entry.section,
      day: entry.day,
      slot: entry.slot,
      type: entry.type,
      subject: entry.subject,
      room: entry.room,
      faculty: entry.faculty || ""
    }));

    const result = await AcademicCalendar.insertMany(sanitized);
    res.status(201).json({ message: 'Timetable saved successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Bulk insert failed' });
  }
});

// 2. View timetable for a year and section
router.get('/view', async (req, res) => {
  const { year, section } = req.query;
  if (!year || !section) {
    return res.status(400).json({ message: 'Year and section are required' });
  }

  try {
    const data = await AcademicCalendar.find({ year, section });
    const structured = {};

    data.forEach(entry => {
      if (!structured[entry.day]) structured[entry.day] = {};
      structured[entry.day][entry.slot] = `${entry.subject} (${entry.room})`;
    });

    res.json(structured);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetch timetable failed' });
  }
});

// 3. View all timetable entries (for academic slot blocking)
router.get('/view-all', async (req, res) => {
  try {
    const data = await AcademicCalendar.find({});
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetch all entries failed' });
  }
});

// 4. Map a section to a classroom
router.post('/map-room', async (req, res) => {
  const { year, section, room } = req.body;
  if (!year || !section || !room) {
    return res.status(400).json({ message: 'Year, section and room are required' });
  }

  try {
    const existingMapping = await ClassroomMap.findOne({ year, section });
    if (existingMapping) {
      existingMapping.room = room;
      await existingMapping.save();
      res.json({ message: 'Classroom mapping updated' });
    } else {
      const newMapping = new ClassroomMap({ year, section, room });
      await newMapping.save();
      res.json({ message: 'Classroom mapped successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Mapping failed' });
  }
});

// 5. Get mapped room for a section
router.get('/get-room', async (req, res) => {
  const { year, section } = req.query;
  if (!year || !section) {
    return res.status(400).json({ message: 'Year and section are required' });
  }

  try {
    const mapping = await ClassroomMap.findOne({ year, section });
    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }
    res.json({ room: mapping.room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching mapping' });
  }
});

// 6. Ping route (health check)
router.get('/ping', (req, res) => {
  res.send('pong');
});

module.exports = router;
