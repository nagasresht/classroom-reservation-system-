import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function AdminHistory() {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const fetchHistory = async () => {
    const res = await fetch('http://localhost:5000/api/bookings');
    const data = await res.json();
    const filteredData = data.filter(b => b.status !== 'Pending');
    setHistory(filteredData);
    setFiltered(filteredData);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    const result = history.filter(b =>
      b.room.toLowerCase().includes(q) ||
      b.facultyName.toLowerCase().includes(q) ||
      b.department.toLowerCase().includes(q)
    );
    setFiltered(result);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-700">Booking History</h1>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
          >
            ← Back to Admin Panel
          </button>
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by room, faculty, or department..."
            value={query}
            onChange={handleSearch}
            className="w-full max-w-md border border-purple-300 px-4 py-2 rounded shadow focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading history...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600">No matching results.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <thead className="bg-purple-100 text-gray-700">
                <tr>
                  <th className="p-3 border">Room</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Slot</th>
                  <th className="p-3 border">Faculty</th>
                  <th className="p-3 border">Department</th>
                  <th className="p-3 border">Reason</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border text-center">{booking.room}</td>
                    <td className="p-3 border text-center">{booking.date}</td>
                    <td className="p-3 border text-center">{booking.slot}</td>
                    <td className="p-3 border text-center">{booking.facultyName}</td>
                    <td className="p-3 border text-center">{booking.department}</td>
                    <td className="p-3 border text-center">{booking.reason}</td>
                    <td className="p-3 border text-center">
                      {booking.status === 'Approved' ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Approved</span>
                      ) : (
                        <div className="text-red-600 text-sm font-semibold">
                          Rejected
                          {booking.rejectionReason && (
                            <div className="text-xs text-gray-500">({booking.rejectionReason})</div>
                          )}
                        </div>
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
