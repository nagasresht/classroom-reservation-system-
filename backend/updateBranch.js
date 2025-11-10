// Script to add default branch to existing academic calendar entries
require('dotenv').config();
const mongoose = require('mongoose');
const AcademicCalendar = require('./models/AcademicCalendar');

async function updateBranch() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all entries without a branch to have 'CSE' as default
    const result = await AcademicCalendar.updateMany(
      { $or: [{ branch: null }, { branch: '' }, { branch: { $exists: false } }] },
      { $set: { branch: 'CSE' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} entries with default branch 'CSE'`);
    console.log(`Total entries matched: ${result.matchedCount}`);

    // Show some examples
    const updated = await AcademicCalendar.find({}).limit(5);
    console.log('\nSample entries:');
    updated.forEach(entry => {
      console.log(`- ${entry.branch} ${entry.year} ${entry.section}: ${entry.subject} (${entry.day} ${entry.slot})`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateBranch();
