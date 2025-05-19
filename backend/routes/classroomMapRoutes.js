// backend/routes/classroomMapRoutes.js
const express = require('express');
const router = express.Router();
const ClassroomMap = require('../models/ClassroomMap');

// 📌 Assign or update classroom to section
router.post('/map-room', async (req, res) => {
  const { year, section, room } = req.body;

  try {
    const existing = await ClassroomMap.findOne({ year, section });
    const conflict = await ClassroomMap.findOne({ room });

    if (conflict && !(conflict.year === year && conflict.section === section)) {
      return res.status(400).json({ message: `❌ Room ${room} is already mapped to another section.` });
    }

    if (existing) {
      existing.room = room;
      await existing.save();
      return res.json({ message: '✅ Room updated successfully.' });
    }

    await new ClassroomMap({ year, section, room }).save();
    res.status(201).json({ message: '✅ Room mapped successfully.' });
  } catch (err) {
    console.error('Error in map-room:', err);
    res.status(500).json({ message: '❌ Server error while mapping room.' });
  }
});

// 📌 Fetch room mapped to a section
router.get('/get-room', async (req, res) => {
  const { year, section } = req.query;

  try {
    const record = await ClassroomMap.findOne({ year, section });
    if (!record) return res.status(404).json({ message: '❌ No room mapping found.' });

    res.json({ room: record.room });
  } catch (err) {
    console.error('Error in get-room:', err);
    res.status(500).json({ message: '❌ Server error fetching room.' });
  }
});

module.exports = router;
