const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

console.log('🔥 BOOKING ROUTES LOADED - Code is active!');

router.post('/book', async (req, res) => {
  try {
    console.log('📝 New booking request received:', req.body);
    
    const { slots, ...restData } = req.body;
    
    // Ensure slots is an array (backward compatibility with old single slot format)
    let slotsArray = slots;
    if (!Array.isArray(slots)) {
      slotsArray = [slots];
    }

    console.log('Slots array:', slotsArray);
    console.log('Status from request:', restData.status);

    // Validate all slots are available
    for (const slot of slotsArray) {
      const existingApproved = await Booking.findOne({
        room: restData.room,
        date: restData.date,
        slots: slot,
        status: 'Approved'
      });

      if (existingApproved) {
        console.log(`❌ Slot ${slot} already approved`);
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
        console.log(`❌ You already have pending request for slot ${slot}`);
        return res.status(400).json({ 
          message: `You already have a pending request for slot ${slot}` 
        });
      }
    }

    // Create booking with multiple slots
    const booking = new Booking({
      ...restData,
      slots: slotsArray,
      appliedBy: restData.facultyName,
      appliedByEmail: restData.email
    });
    
    console.log('💾 Saving booking with data:', {
      room: booking.room,
      date: booking.date,
      slots: booking.slots,
      status: booking.status,
      email: booking.email,
      appliedBy: booking.appliedBy
    });
    
    await booking.save();
    
    console.log('✅ Booking saved successfully with ID:', booking._id);
    console.log('Final booking status:', booking.status);
    
    res.status(201).json({ message: 'Booking submitted successfully' });
  } catch (err) {
    console.error('❌ Booking error:', err);
    res.status(500).json({ message: 'Server error while booking' });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    // FIXED: Support filtering by status query parameter
    // Example: /api/bookings?status=Pending
    const { status } = req.query;
    
    console.log('GET /bookings called with status:', status || 'all');
    
    let query = {};
    // Only filter by status if it's provided and not empty
    if (status && status !== '') {
      query.status = status;
    }
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`Found ${bookings.length} bookings with query:`, query);
    console.log('Status breakdown:', {
      Pending: bookings.filter(b => b.status === 'Pending').length,
      Approved: bookings.filter(b => b.status === 'Approved').length,
      Rejected: bookings.filter(b => b.status === 'Rejected').length
    });
    
    res.json(bookings);
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

router.patch('/bookings/:id', async (req, res) => {
  try {
    const { status, rejectionReason, approvedBy, approvedByEmail } = req.body;
    
    console.log('📥 Received PATCH request for booking:', req.params.id);
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    const target = await Booking.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    console.log('📋 Current booking before update:', {
      id: target._id,
      room: target.room,
      status: target.status,
      appliedBy: target.appliedBy,
      approvedBy: target.approvedBy
    });

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
    
    // Save who approved/rejected the booking
    if (status === 'Approved' || status === 'Rejected') {
      target.approvedBy = approvedBy || 'Admin';
      target.approvedByEmail = approvedByEmail || '';
      console.log('💾 Saving approvedBy:', target.approvedBy, 'Email:', target.approvedByEmail);
    }
    
    await target.save();
    console.log('✅ Booking updated. ApprovedBy field:', target.approvedBy);

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

// Auto-expire pending bookings that have passed their time slot
router.post('/auto-expire-bookings', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all pending bookings
    const pendingBookings = await Booking.find({ status: 'Pending' });
    let expiredCount = 0;
    
    for (const booking of pendingBookings) {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      
      let isExpired = false;
      
      // If booking date is in the past
      if (bookingDate < today) {
        isExpired = true;
      } else if (bookingDate.getTime() === today.getTime()) {
        // If booking is today, check if time has passed
        const slots = booking.slots || [booking.slot];
        const lastSlot = slots[slots.length - 1];
        const endTimeStr = lastSlot.split(' - ')[1] || lastSlot.split('–')[1];
        
        if (endTimeStr) {
          const timeParts = endTimeStr.trim().split(':');
          const endHour = parseInt(timeParts[0]);
          const endMinute = timeParts[1] ? parseInt(timeParts[1]) : 0;
          
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          const currentMinutes = currentHour * 60 + currentMinute;
          const endMinutes = endHour * 60 + endMinute;
          
          if (currentMinutes >= endMinutes) {
            isExpired = true;
          }
        }
      }
      
      if (isExpired) {
        booking.status = 'Rejected';
        booking.rejectionReason = 'Time slot expired (auto-rejected)';
        await booking.save();
        expiredCount++;
      }
    }
    
    res.json({ message: `${expiredCount} expired bookings auto-rejected`, count: expiredCount });
  } catch (err) {
    console.error('Auto-expire error:', err);
    res.status(500).json({ message: 'Error auto-expiring bookings' });
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
