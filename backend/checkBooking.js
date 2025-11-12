require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');

async function checkBooking() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get one booking to see its structure
    const booking = await Booking.findOne().sort({ createdAt: -1 });
    
    if (booking) {
      console.log('\n📋 Sample Booking:');
      console.log('ID:', booking._id);
      console.log('Room:', booking.room);
      console.log('Status:', booking.status);
      console.log('Faculty Name:', booking.facultyName);
      console.log('Email:', booking.email);
      console.log('appliedBy:', booking.appliedBy);
      console.log('appliedByEmail:', booking.appliedByEmail);
      console.log('approvedBy:', booking.approvedBy);
      console.log('approvedByEmail:', booking.approvedByEmail);
      console.log('\n🔍 Full booking object:');
      console.log(JSON.stringify(booking, null, 2));
    } else {
      console.log('❌ No bookings found');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBooking();
