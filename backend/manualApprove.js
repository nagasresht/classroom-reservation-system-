require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');

async function manualApprove() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find a pending or any booking
    const booking = await Booking.findOne();
    
    if (!booking) {
      console.log('❌ No bookings found');
      await mongoose.connection.close();
      return;
    }

    console.log('📋 Found booking:', booking._id);
    console.log('Current status:', booking.status);
    console.log('Current approvedBy:', booking.approvedBy || 'EMPTY');

    // Update it
    booking.status = 'Approved';
    booking.approvedBy = 'admin1';
    booking.approvedByEmail = 'admin1@example.com';
    
    await booking.save();
    
    console.log('\n✅ Booking updated!');
    console.log('New status:', booking.status);
    console.log('New approvedBy:', booking.approvedBy);
    console.log('New approvedByEmail:', booking.approvedByEmail);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

manualApprove();
