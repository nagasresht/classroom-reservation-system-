const mongoose = require('mongoose');
const Booking = require('./models/Booking');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Check E032 bookings for Nov 19, 2025
    const bookings = await Booking.find({ 
      room: 'E032', 
      date: '2025-11-19' 
    });
    
    console.log(`\n📋 Found ${bookings.length} bookings for E032 on 2025-11-19:\n`);
    
    bookings.forEach((b, index) => {
      console.log(`Booking #${index + 1}:`);
      console.log(`  Room: ${b.room}`);
      console.log(`  Date: ${b.date}`);
      console.log(`  Status: ${b.status}`);
      console.log(`  Booking Type: ${b.bookingType}`);
      console.log(`  Slots (array): ${JSON.stringify(b.slots)}`);
      console.log(`  Slot (single): ${b.slot}`);
      console.log(`  Applied By: ${b.appliedBy}`);
      console.log('---');
    });
    
    // Now check what the availability query would return
    console.log('\n🔍 Testing availability query for 11:00-12:00...\n');
    
    const testBookings = await Booking.find({
      date: '2025-11-19',
      status: { $in: ['Approved', 'Pending'] },
      $or: [
        { slots: '11:00-12:00' },
        { slot: '11:00-12:00' }
      ]
    });
    
    console.log(`Found ${testBookings.length} bookings matching "11:00-12:00":`);
    testBookings.forEach(b => {
      console.log(`  - ${b.room} (slots: ${JSON.stringify(b.slots)}, slot: ${b.slot})`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
