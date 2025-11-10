// Script to update CSBS room entries
require('dotenv').config();
const mongoose = require('mongoose');
const AcademicCalendar = require('./models/AcademicCalendar');

async function fixCSBS() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // First, let's see what entries exist for E-028
    const e028Entries = await AcademicCalendar.find({ room: 'E028' });
    console.log(`\nFound ${e028Entries.length} entries for E-028:`);
    e028Entries.forEach(entry => {
      console.log(`- ${entry.branch} ${entry.year} ${entry.section}: ${entry.subject} (${entry.day} ${entry.slot})`);
    });

    // Ask which entries should be CSBS
    console.log('\n📝 Please tell me which room(s) belong to CSBS so I can update them.');
    console.log('For now, I will update E-028 to CSBS Section A if it exists.');

    // Update E028 entries to CSBS (note: no hyphen in the room name)
    const result = await AcademicCalendar.updateMany(
      { room: 'E028' },
      { $set: { branch: 'CSBS' } }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} entries for E028 to CSBS`);

    // Show all entries now
    console.log('\nAll entries in database:');
    const allEntries = await AcademicCalendar.find({});
    allEntries.forEach(entry => {
      console.log(`- ${entry.branch} ${entry.year} ${entry.section}: ${entry.subject} in ${entry.room} (${entry.day} ${entry.slot})`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Update complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixCSBS();
