import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import HomePage from './HomePage';
import AdminPanel from './AdminPanel';
import PrivateRoute from './PrivateRoute';
import AdminCalendarPanel from './AdminCalendarPanel';
import AdminTimetableView from './AdminTimetableView';
import AdminTimetable from './AdminTimetable'; // NEW: Step-by-step timetable entry
import AdminDashboard from './AdminDashboard';
import AdminHistory from './AdminHistory';




export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      <Route path="/admin-panel" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      <Route path="/admin-calendar" element={<PrivateRoute><AdminCalendarPanel /></PrivateRoute>} />
      <Route path="/admin-add-timetable" element={<PrivateRoute><AdminTimetable /></PrivateRoute>} />
      <Route path="/admin-timetable" element={<PrivateRoute><AdminTimetableView /></PrivateRoute>} />
      <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin-history" element={<PrivateRoute><AdminHistory /></PrivateRoute>} />
      
    </Routes>
  );
}
// Inside your <Routes> block: