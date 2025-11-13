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
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/classroom', classroomMapRoutes);
app.use('/api', notificationRoutes);

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server at http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
