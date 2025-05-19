const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server at http://localhost:5000'));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
