import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import VerifyOTP from './VerifyOTP';
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
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* User Routes - Require Authentication */}
      <Route path="/dashboard" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      
      {/* Admin Routes - Require Authentication AND Admin Role */}
      <Route path="/admin" element={<PrivateRoute requireAdmin={true}><AdminPanel /></PrivateRoute>} />
      <Route path="/admin-panel" element={<PrivateRoute requireAdmin={true}><AdminPanel /></PrivateRoute>} />
      <Route path="/admin-calendar" element={<PrivateRoute requireAdmin={true}><AdminCalendarPanel /></PrivateRoute>} />
      <Route path="/admin-add-timetable" element={<PrivateRoute requireAdmin={true}><AdminTimetable /></PrivateRoute>} />
      <Route path="/admin-timetable" element={<PrivateRoute requireAdmin={true}><AdminTimetableView /></PrivateRoute>} />
      <Route path="/admin-dashboard" element={<PrivateRoute requireAdmin={true}><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin-history" element={<PrivateRoute requireAdmin={true}><AdminHistory /></PrivateRoute>} />
      
    </Routes>
  );
}
// Inside your <Routes> block: