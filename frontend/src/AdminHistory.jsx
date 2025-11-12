import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

// Helper function to format slots display
function formatSlotsDisplay(slots) {
  if (!slots || slots.length === 0) return "";
  if (slots.length === 1) return slots[0];

  const sortedSlots = [...slots].sort();
  const timeSlots = [
    "9:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 1:40",
    "1:40 - 2:40",
    "2:40 - 3:40",
    "3:40 - 4:40",
  ];

  const indices = sortedSlots.map((slot) => timeSlots.indexOf(slot));
  const allConsecutive = indices.every(
    (val, i, arr) => i === 0 || val === arr[i - 1] + 1
  );

  if (allConsecutive && sortedSlots.length > 1) {
    const startTime = sortedSlots[0].split(" - ")[0];
    const endTime = sortedSlots[sortedSlots.length - 1].split(" - ")[1];
    return `${startTime} - ${endTime} (${sortedSlots.length} slots)`;
  }

  return sortedSlots.join(", ");
}

export default function AdminHistory() {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    const filteredData = data.filter((b) => b.status !== "Pending");
    setHistory(filteredData);

    // Re-apply search filter if there's an active query
    if (query) {
      const result = filteredData.filter(
        (b) =>
          b.room.toLowerCase().includes(query.toLowerCase()) ||
          b.facultyName.toLowerCase().includes(query.toLowerCase()) ||
          b.department.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(result);
    } else {
      setFiltered(filteredData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();

    // Auto-refresh history every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchHistory();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    const result = history.filter(
      (b) =>
        b.room.toLowerCase().includes(q) ||
        b.facultyName.toLowerCase().includes(q) ||
        b.department.toLowerCase().includes(q)
    );
    setFiltered(result);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-purple-700 hover:text-purple-900"
            aria-label="Open menu"
          >
            <FaBars size={24} />
          </button>
          <h2 className="text-lg font-bold text-purple-700">Booking History</h2>
          <div className="w-6"></div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-700">
              Booking History
            </h1>
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded text-sm sm:text-base whitespace-nowrap"
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
              className="w-full border border-purple-300 px-4 py-2 rounded shadow focus:ring-2 focus:ring-purple-400 outline-none text-sm sm:text-base"
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-500 text-sm sm:text-base">
              Loading history...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-600 text-sm sm:text-base">
              No matching results.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full table-auto border border-gray-200 rounded-xl shadow-md overflow-hidden min-w-[800px]">
                <thead className="bg-purple-100 text-gray-700">
                  <tr>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Room
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Date
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Slot
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Faculty
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Department
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Reason
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Applied By
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Approved By
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Booked On
                    </th>
                    <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {booking.room}
                      </td>
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {booking.date}
                      </td>
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {formatSlotsDisplay(booking.slots || [booking.slot])}
                      </td>
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {booking.facultyName}
                      </td>
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {booking.department}
                      </td>
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {booking.reason}
                      </td>
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {booking.appliedBy || booking.facultyName}
                        {booking.appliedByEmail && (
                          <div className="text-[10px] text-gray-500">
                            {booking.appliedByEmail}
                          </div>
                        )}
                      </td>
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {booking.approvedBy || "-"}
                        {booking.approvedByEmail && (
                          <div className="text-[10px] text-gray-500">
                            {booking.approvedByEmail}
                          </div>
                        )}
                      </td>
                      <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="p-2 sm:p-3 border text-center">
                        {booking.status === "Approved" ? (
                          <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            Approved
                          </span>
                        ) : (
                          <div className="text-red-600 text-xs sm:text-sm font-semibold">
                            Rejected
                            {booking.rejectionReason && (
                              <div className="text-xs text-gray-500">
                                ({booking.rejectionReason})
                              </div>
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
    </div>
  );
}
