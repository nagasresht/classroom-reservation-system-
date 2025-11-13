import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaClipboardList, FaCalendarAlt, FaBook, FaHistory, FaTrashRestoreAlt, FaBars } from 'react-icons/fa';
import API_BASE_URL from './config/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleResetBookings = async () => {
    const confirm = window.confirm("⚠️ Are you sure you want to reset all bookings? This cannot be undone.");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-bookings`, {
        method: "DELETE"
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("❌ Failed to reset bookings. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-purple-700 hover:text-purple-900"
            aria-label="Open menu"
          >
            <FaBars size={24} />
          </button>
          <h2 className="text-lg font-bold text-purple-700">Admin Dashboard</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        <div className="p-4 sm:p-6 lg:p-10">
          {/* Header with Reset Button */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-purple-700">
                Welcome, {user?.name || 'Admin'} 👋
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
                Manage classroom bookings and timetables here.
              </p>
            </div>
            <button
              onClick={handleResetBookings}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              <FaTrashRestoreAlt /> Reset All Bookings
            </button>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2 text-base sm:text-lg transition-colors"
            >
              <FaClipboardList /> Booking Requests
            </button>

            <button
              onClick={() => navigate('/admin-add-timetable')}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2 text-base sm:text-lg transition-colors"
            >
              <FaCalendarAlt /> Add Timetable Entry
            </button>

            <button
              onClick={() => navigate('/admin-timetable')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2 text-base sm:text-lg transition-colors"
            >
              <FaBook /> View Timetable
            </button>

            <button
              onClick={() => navigate('/admin-history')}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2 text-base sm:text-lg transition-colors sm:col-span-2 lg:col-span-1"
            >
              <FaHistory /> Booking History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
