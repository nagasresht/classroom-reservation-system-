require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');

async function updateAppliedBy() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update all bookings that don't have appliedBy field
    const result = await Booking.updateMany(
      { 
        $or: [
          { appliedBy: null },
          { appliedBy: { $exists: false } }
        ]
      },
      {
        $set: {
          appliedBy: '$facultyName',
          appliedByEmail: '$email'
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} bookings`);

    // Also copy facultyName and email to appliedBy fields for all bookings
    const bookings = await Booking.find({ 
      $or: [
        { appliedBy: null },
        { appliedBy: { $exists: false } }
      ]
    });

    for (const booking of bookings) {
      booking.appliedBy = booking.facultyName;
      booking.appliedByEmail = booking.email;
      await booking.save();
    }

    console.log(`✅ Processed ${bookings.length} bookings with appliedBy field`);

    await mongoose.connection.close();
    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

updateAppliedBy();
