// Script to display all booked details and timetable data
require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const AcademicCalendar = require('./models/AcademicCalendar');

async function showAllData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // ========== ACADEMIC TIMETABLE DATA ==========
    console.log('═'.repeat(80));
    console.log('📚 ACADEMIC TIMETABLE DATA');
    console.log('═'.repeat(80));
    
    const academicEntries = await AcademicCalendar.find({}).sort({ day: 1, slot: 1 });
    
    if (academicEntries.length === 0) {
      console.log('No timetable entries found.\n');
    } else {
      console.log(`Total Entries: ${academicEntries.length}\n`);
      
      // Group by day
      const groupedByDay = {};
      academicEntries.forEach(entry => {
        if (!groupedByDay[entry.day]) {
          groupedByDay[entry.day] = [];
        }
        groupedByDay[entry.day].push(entry);
      });

      Object.keys(groupedByDay).forEach(day => {
        console.log(`\n📅 ${day.toUpperCase()}`);
        console.log('─'.repeat(80));
        groupedByDay[day].forEach(entry => {
          console.log(`  🕐 ${entry.slot.padEnd(15)} | ${entry.type.padEnd(6)} | ${entry.room.padEnd(15)} | ${entry.branch || 'N/A'} ${entry.year} ${entry.section}`);
          console.log(`     Subject: ${entry.subject}`);
          console.log(`     Faculty: ${entry.faculty || 'Not assigned'}`);
          console.log();
        });
      });
    }

    // ========== BOOKING DATA ==========
    console.log('\n' + '═'.repeat(80));
    console.log('📝 BOOKING DATA');
    console.log('═'.repeat(80));
    
    const bookings = await Booking.find({}).sort({ date: 1, createdAt: -1 });
    
    if (bookings.length === 0) {
      console.log('No bookings found.\n');
    } else {
      console.log(`Total Bookings: ${bookings.length}\n`);
      
      // Group by status
      const pending = bookings.filter(b => b.status === 'Pending');
      const approved = bookings.filter(b => b.status === 'Approved');
      const rejected = bookings.filter(b => b.status === 'Rejected');

      console.log(`\n📊 STATUS SUMMARY:`);
      console.log(`   ⏳ Pending: ${pending.length}`);
      console.log(`   ✅ Approved: ${approved.length}`);
      console.log(`   ❌ Rejected: ${rejected.length}`);

      // Show all bookings
      console.log('\n\n📋 ALL BOOKINGS:');
      console.log('─'.repeat(80));
      
      bookings.forEach((booking, index) => {
        const statusIcon = booking.status === 'Approved' ? '✅' : booking.status === 'Rejected' ? '❌' : '⏳';
        console.log(`\n${index + 1}. ${statusIcon} ${booking.status.toUpperCase()}`);
        console.log(`   Room: ${booking.room}`);
        console.log(`   Date: ${new Date(booking.date).toLocaleDateString()}`);
        console.log(`   Slots: ${booking.slots ? booking.slots.join(', ') : 'N/A'}`);
        console.log(`   Faculty: ${booking.facultyName} (${booking.email})`);
        console.log(`   Purpose: ${booking.purpose || 'Not specified'}`);
        console.log(`   Created: ${new Date(booking.createdAt).toLocaleString()}`);
        if (booking.adminNotes) {
          console.log(`   Admin Notes: ${booking.adminNotes}`);
        }
      });
    }

    console.log('\n' + '═'.repeat(80));
    await mongoose.disconnect();
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

showAllData();
