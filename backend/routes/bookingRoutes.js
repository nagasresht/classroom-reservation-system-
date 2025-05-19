const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/book', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while booking' });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

router.patch('/bookings/:id', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const target = await Booking.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status === 'Approved') {
      const conflict = await Booking.findOne({
        _id: { $ne: req.params.id },
        room: target.room,
        date: target.date,
        slot: target.slot,
        status: 'Approved'
      });

      if (conflict) {
        return res.status(400).json({
          message: `This slot is already approved by ${conflict.facultyName}`
        });
      }
    }

    target.status = status;
    if (status === 'Rejected') target.rejectionReason = rejectionReason || '';
    await target.save();
    res.json(target);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

router.delete('/reset-bookings', async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.status(200).json({ message: '✅ All bookings reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing bookings.' });
  }
});

module.exports = router;
