import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaClipboardList, FaCalendarAlt, FaBook, FaHistory, FaTrashRestoreAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleResetBookings = async () => {
    const confirm = window.confirm("⚠️ Are you sure you want to reset all bookings? This cannot be undone.");
    if (!confirm) return;

    try {
      const res = await fetch("http://localhost:5000/api/reset-bookings", {
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-50">
        {/* Header with Reset Button */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-purple-700">
              Welcome, {user?.name || 'Admin'} 👋
            </h1>
            <p className="text-gray-600 text-lg">Manage classroom bookings and timetables here.</p>
          </div>
          <button
            onClick={handleResetBookings}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
          >
            <FaTrashRestoreAlt /> Reset All Bookings
          </button>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2 text-lg"
          >
            <FaClipboardList /> Booking Requests
          </button>

          <button
            onClick={() => navigate('/admin-add-timetable')}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2 text-lg"
          >
            <FaCalendarAlt /> Add Timetable Entry
          </button>

          <button
            onClick={() => navigate('/admin-timetable')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2 text-lg"
          >
            <FaBook /> View Timetable
          </button>

          <button
            onClick={() => navigate('/admin-history')}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2 text-lg"
          >
            <FaHistory /> Booking History
          </button>
        </div>
      </div>
    </div>
  );
}
