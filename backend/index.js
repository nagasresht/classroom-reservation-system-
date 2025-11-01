const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Environment loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookingRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
// backend/index.js
const classroomMapRoutes = require('./routes/classroomMapRoutes');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/classroom', classroomMapRoutes);

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server at http://localhost:5000'));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
