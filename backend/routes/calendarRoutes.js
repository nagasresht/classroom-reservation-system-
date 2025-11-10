const express = require('express');
const router = express.Router();
const AcademicCalendar = require('../models/AcademicCalendar');
const ClassroomMap = require('../models/ClassroomMap');
const SectionRoom = require('../models/SectionRoom');

// 1. Save timetable entries (bulk insert)
router.post('/bulk', async (req, res) => {
  const { entries } = req.body;
  if (!entries || !Array.isArray(entries)) {
    return res.status(400).json({ message: 'Entries must be an array' });
  }

  try {
    const sanitized = entries.map(entry => ({
      branch: entry.branch || "",
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
    
    // Dynamically add default branch 'CSE' if missing
    const dataWithBranch = data.map(entry => {
      const entryObj = entry.toObject();
      if (!entryObj.branch || entryObj.branch === '') {
        entryObj.branch = 'CSE'; // Default to CSE for old entries
      }
      return entryObj;
    });
    
    res.json(dataWithBranch);
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

// 7. Get section room mapping
router.get('/section-room/:year/:section', async (req, res) => {
  const { year, section } = req.params;
  try {
    const mapping = await SectionRoom.findOne({ year, section });
    if (mapping) {
      res.json({ room: mapping.room });
    } else {
      res.json({ room: null });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching section room mapping' });
  }
});

// 8. Save section room mapping
router.post('/section-room', async (req, res) => {
  const { year, section, room } = req.body;
  if (!year || !section || !room) {
    return res.status(400).json({ message: 'Year, section, and room are required' });
  }

  try {
    // Use findOneAndUpdate with upsert to create or update
    const mapping = await SectionRoom.findOneAndUpdate(
      { year, section },
      { room },
      { upsert: true, new: true }
    );
    res.status(201).json({ message: 'Section room mapping saved', data: mapping });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving section room mapping' });
  }
});

// 9. Get all section room mappings
router.get('/section-rooms', async (req, res) => {
  try {
    const mappings = await SectionRoom.find().sort({ year: 1, section: 1 });
    res.json(mappings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching section room mappings' });
  }
});

// 10. Delete all academic calendar entries (for testing/reset)
router.delete('/delete-all', async (req, res) => {
  try {
    const result = await AcademicCalendar.deleteMany({});
    res.json({ 
      message: 'All academic calendar entries deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting academic calendar entries' });
  }
});

// 11. Delete all section room mappings (for testing/reset)
router.delete('/delete-all-rooms', async (req, res) => {
  try {
    const result = await SectionRoom.deleteMany({});
    res.json({ 
      message: 'All section room mappings deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting section room mappings' });
  }
});

module.exports = router;
