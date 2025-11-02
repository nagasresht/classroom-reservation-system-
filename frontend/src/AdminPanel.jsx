import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

// Helper function to format slots display
function formatSlotsDisplay(slots) {
  if (!slots || slots.length === 0) return '';
  if (slots.length === 1) return slots[0];
  
  // Sort slots
  const sortedSlots = [...slots].sort();
  
  // Check if consecutive
  const timeSlots = [
    "9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 1:40",
    "1:40 - 2:40", "2:40 - 3:40", "3:40 - 4:40"
  ];
  
  const indices = sortedSlots.map(slot => timeSlots.indexOf(slot));
  const allConsecutive = indices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
  
  if (allConsecutive && sortedSlots.length > 1) {
    const startTime = sortedSlots[0].split(' - ')[0];
    const endTime = sortedSlots[sortedSlots.length - 1].split(' - ')[1];
    return `${startTime} - ${endTime} (${sortedSlots.length} slots)`;
  }
  
  return sortedSlots.join(', ');
}

export default function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState({});
  const [filter, setFilter] = useState('Pending');
  const navigate = useNavigate();

  const predefinedReasons = [
    "Already occupied",
    "Irrelevant request",
    "Insufficient justification",
    "Maintenance work scheduled",
    "Other reason"
  ];

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/bookings?status=${filter}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const updateStatus = async (id, status, reason = '') => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: reason })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Booking ${status}`);
        fetchBookings();
      } else {
        alert(`❌ ${data.message || 'Update failed'}`);
      }
    } catch (err) {
      alert('❌ Network error while updating booking.');
      console.error(err);
    }
  };

  const handleResetBookings = async () => {
    if (window.confirm('Are you sure you want to reset ALL bookings?')) {
      try {
        const res = await fetch('http://localhost:5000/api/reset-bookings', {
          method: 'DELETE'
        });

        if (res.ok) {
          alert('All bookings reset successfully');
          fetchBookings();
        } else {
          alert('Failed to reset bookings');
        }
      } catch (err) {
        alert('Network error while resetting bookings');
        console.error(err);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-700">Booking Management</h1>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
          >
            ← Back to Admin Panel
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('Pending')}
              className={`px-4 py-2 rounded ${filter === 'Pending' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Approved')}
              className={`px-4 py-2 rounded ${filter === 'Approved' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`px-4 py-2 rounded ${filter === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded ${filter === '' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
          </div>
          <button
            onClick={handleResetBookings}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
          >
            Reset All Bookings
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600">No bookings found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <thead className="bg-purple-100 text-gray-700">
                <tr>
                  <th className="p-3 border">Room</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Slot</th>
                  <th className="p-3 border">Faculty</th>
                  <th className="p-3 border">Dept</th>
                  <th className="p-3 border">Reason</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border text-center">{booking.room}</td>
                    <td className="p-3 border text-center">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="p-3 border text-center">
                      {formatSlotsDisplay(booking.slots || [booking.slot])}
                    </td>
                    <td className="p-3 border text-center">{booking.facultyName}</td>
                    <td className="p-3 border text-center">{booking.department}</td>
                    <td className="p-3 border text-center">{booking.reason}</td>
                    <td className="p-3 border text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status} ({booking.facultyName})
                      </span>
                    </td>
                    <td className="p-3 border text-center space-y-2">
                      {booking.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(booking._id, 'Approved')}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <div className="mt-2">
                            <select
                              className="border px-2 py-1 rounded text-sm"
                              value={rejectionReason[booking._id] || ''}
                              onChange={(e) =>
                                setRejectionReason({ ...rejectionReason, [booking._id]: e.target.value })
                              }
                            >
                              <option value="">Select reason</option>
                              {predefinedReasons.map((r, i) => (
                                <option key={i} value={r}>{r}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => updateStatus(booking._id, 'Rejected', rejectionReason[booking._id])}
                              disabled={!rejectionReason[booking._id]}
                              className="ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </>
                      )}
                      {booking.status === 'Approved' && (
                        <button
                          onClick={() => updateStatus(booking._id, 'Rejected', 'Manual cancellation')}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
