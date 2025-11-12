require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');

async function testBooking() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get the most recent booking
    const booking = await Booking.findOne().sort({ updatedAt: -1 });
    
    if (!booking) {
      console.log('❌ No bookings found in database');
      await mongoose.connection.close();
      return;
    }

    console.log('📋 Most Recent Booking:');
    console.log('=====================================');
    console.log('ID:', booking._id);
    console.log('Room:', booking.room);
    console.log('Date:', booking.date);
    console.log('Status:', booking.status);
    console.log('Faculty Name:', booking.facultyName);
    console.log('Email:', booking.email);
    console.log('\n📌 Applied By Info:');
    console.log('appliedBy:', booking.appliedBy || '❌ EMPTY');
    console.log('appliedByEmail:', booking.appliedByEmail || '❌ EMPTY');
    console.log('\n✅ Approved By Info:');
    console.log('approvedBy:', booking.approvedBy || '❌ EMPTY');
    console.log('approvedByEmail:', booking.approvedByEmail || '❌ EMPTY');
    console.log('\n📅 Timestamps:');
    console.log('Created:', booking.createdAt);
    console.log('Updated:', booking.updatedAt);
    console.log('\n=====================================');

    // Count total bookings
    const total = await Booking.countDocuments();
    console.log(`\n📊 Total bookings in database: ${total}`);

    // Count bookings with approvedBy field
    const withApprovedBy = await Booking.countDocuments({ 
      approvedBy: { $ne: null, $exists: true } 
    });
    console.log(`✅ Bookings with approvedBy: ${withApprovedBy}`);
    
    const withoutApprovedBy = total - withApprovedBy;
    console.log(`❌ Bookings without approvedBy: ${withoutApprovedBy}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testBooking();
