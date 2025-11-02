const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

router.post('/book', async (req, res) => {
  try {
    const { slots, ...restData } = req.body;
    
    // Ensure slots is an array (backward compatibility with old single slot format)
    let slotsArray = slots;
    if (!Array.isArray(slots)) {
      slotsArray = [slots];
    }

    // Validate all slots are available
    for (const slot of slotsArray) {
      const existingApproved = await Booking.findOne({
        room: restData.room,
        date: restData.date,
        slots: slot,
        status: 'Approved'
      });

      if (existingApproved) {
        return res.status(400).json({ 
          message: `Slot ${slot} is already approved for ${existingApproved.facultyName}` 
        });
      }

      const existingPending = await Booking.findOne({
        room: restData.room,
        date: restData.date,
        slots: slot,
        email: restData.email,
        status: 'Pending'
      });

      if (existingPending) {
        return res.status(400).json({ 
          message: `You already have a pending request for slot ${slot}` 
        });
      }
    }

    // Create booking with multiple slots
    const booking = new Booking({
      ...restData,
      slots: slotsArray
    });
    
    await booking.save();
    res.status(201).json({ message: 'Booking submitted successfully' });
  } catch (err) {
    console.error('Booking error:', err);
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
      // Check if any of the slots in this booking are already approved
      for (const slot of target.slots) {
        const conflict = await Booking.findOne({
          _id: { $ne: req.params.id },
          room: target.room,
          date: target.date,
          slots: slot,
          status: 'Approved'
        });

        if (conflict) {
          return res.status(400).json({
            message: `Slot ${slot} is already approved for ${conflict.facultyName}`
          });
        }
      }
    }

    target.status = status;
    if (status === 'Rejected') target.rejectionReason = rejectionReason || '';
    await target.save();

    // Format slots for display (show as range if consecutive)
    const slotsDisplay = formatSlotsForDisplay(target.slots);

    // Create notification for the user
    const notificationMessage = status === 'Approved'
      ? `🎉 Your booking for ${target.room} on ${target.date} (${slotsDisplay}) has been approved!`
      : `❌ Your booking for ${target.room} on ${target.date} (${slotsDisplay}) has been rejected. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`;

    const notification = new Notification({
      userId: target.email,
      message: notificationMessage,
      type: status === 'Approved' ? 'approved' : 'rejected',
      bookingDetails: {
        room: target.room,
        date: target.date,
        slot: slotsDisplay,
        reason: target.reason
      }
    });

    await notification.save();

    res.json(target);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// Helper function to format slots as continuous range
function formatSlotsForDisplay(slots) {
  if (!slots || slots.length === 0) return '';
  if (slots.length === 1) return slots[0];
  
  // Sort slots by start time
  const sortedSlots = [...slots].sort();
  
  // Check if slots are consecutive
  const timeSlots = [
    "8:00–9:00", "9:00–10:00", "10:00–11:00", "11:00–12:00",
    "12:00–1:00", "1:00–2:00", "2:00–3:00", "3:00–4:00", "4:00–5:00"
  ];
  
  const indices = sortedSlots.map(slot => timeSlots.indexOf(slot));
  const allConsecutive = indices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
  
  if (allConsecutive) {
    // Extract start time from first slot and end time from last slot
    const startTime = sortedSlots[0].split('–')[0];
    const endTime = sortedSlots[sortedSlots.length - 1].split('–')[1];
    return `${startTime}–${endTime}`;
  }
  
  // Non-consecutive: show as comma-separated list
  return sortedSlots.join(', ');
}

router.delete('/reset-bookings', async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.status(200).json({ message: '✅ All bookings reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing bookings.' });
  }
});

module.exports = router;
