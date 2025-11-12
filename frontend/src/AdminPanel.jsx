import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";

// Helper function to format slots display
function formatSlotsDisplay(slots) {
  if (!slots || slots.length === 0) return "";
  if (slots.length === 1) return slots[0];

  // Sort slots
  const sortedSlots = [...slots].sort();

  // Check if consecutive
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

// Helper function to check if booking time has passed
function isBookingExpired(booking) {
  const bookingDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);

  // If booking date is in the past, it's expired
  if (bookingDate < today) {
    return true;
  }

  // If booking date is today, check if all slots have passed
  if (bookingDate.getTime() === today.getTime()) {
    const slots = booking.slots || [booking.slot];
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Get the end time of the last slot
    const lastSlot = slots[slots.length - 1];
    const endTimeStr = lastSlot.split(" - ")[1] || lastSlot.split("–")[1];

    // Parse end time (handle various formats)
    let endHour, endMinute;
    const cleanEndTime = endTimeStr.trim();

    if (cleanEndTime.includes(":")) {
      const parts = cleanEndTime.split(":");
      endHour = parseInt(parts[0]);
      endMinute = parseInt(parts[1]);
    } else {
      endHour = parseInt(cleanEndTime);
      endMinute = 0;
    }

    // Handle PM times (afternoon slots)
    if (endHour < 9 && !cleanEndTime.toLowerCase().includes("am")) {
      endHour += 12;
    }

    // Convert current time to minutes since midnight
    const currentMinutes = currentHour * 60 + currentMinute;
    const endMinutes = endHour * 60 + endMinute;

    // If current time is past the end time of the last slot
    if (currentMinutes >= endMinutes) {
      return true;
    }
  }

  return false;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  
  // Validate admin session
  const validateAdminSession = () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        navigate("/");
        return null;
      }
      
      const user = JSON.parse(userString);
      
      // Validate required fields
      if (!user.email || !user.name) {
        console.error('Invalid user session');
        localStorage.removeItem("user");
        navigate("/");
        return null;
      }
      
      // Check admin role
      if (user.role !== 'admin' && !user.email.toLowerCase().endsWith('@admin.com')) {
        console.warn('Unauthorized: User is not an admin');
        navigate("/dashboard");
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem("user");
      navigate("/");
      return null;
    }
  };

  const adminUser = validateAdminSession();
  
  // If adminUser is null, component will unmount due to redirect
  if (!adminUser) return null;
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState({});
  const [filter, setFilter] = useState("Pending");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const predefinedReasons = [
    "Already occupied",
    "Irrelevant request",
    "Insufficient justification",
    "Maintenance work scheduled",
    "Other reason",
  ];

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // First, trigger auto-expiration of old bookings
      try {
        await fetch("http://localhost:5000/api/auto-expire-bookings", {
          method: "POST",
        });
      } catch (expireErr) {
        console.warn("Auto-expire failed, continuing:", expireErr);
      }

      // FIXED: Properly construct the query URL with status filter
      // When filter is empty string, fetch all bookings (no status filter)
      const statusParam = filter ? `status=${filter}` : "";
      const url = `http://localhost:5000/api/bookings${
        statusParam ? "?" + statusParam : ""
      }`;

      console.log("Fetching bookings with URL:", url);
      console.log("Current filter:", filter);

      const res = await fetch(url);
      const data = await res.json();

      console.log("Received bookings:", data.length);
      console.log("Bookings by status:", {
        Pending: data.filter((b) => b.status === "Pending").length,
        Approved: data.filter((b) => b.status === "Approved").length,
        Rejected: data.filter((b) => b.status === "Rejected").length,
      });

      // REMOVED: Don't filter out expired bookings on frontend
      // Let the backend handle expiration
      setBookings(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Auto-refresh bookings every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, [filter]);

  const updateStatus = async (id, status, reason = "") => {
    try {
      // Use admin1 as default if no user info
      const approverName = adminUser.name || "admin1";
      const approverEmail = adminUser.email || "admin1@example.com";

      console.log("📤 Sending approval with:", {
        approvedBy: approverName,
        approvedByEmail: approverEmail,
        adminUser,
        status,
      });

      const payload = {
        status,
        rejectionReason: reason,
        approvedBy: approverName,
        approvedByEmail: approverEmail,
      };

      console.log("📦 Full payload:", JSON.stringify(payload, null, 2));

      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Booking ${status}`);
        fetchBookings();
      } else {
        alert(`❌ ${data.message || "Update failed"}`);
      }
    } catch (err) {
      alert("❌ Network error while updating booking.");
      console.error(err);
    }
  };

  const handleResetBookings = async () => {
    if (window.confirm("Are you sure you want to reset ALL bookings?")) {
      try {
        const res = await fetch("http://localhost:5000/api/reset-bookings", {
          method: "DELETE",
        });

        if (res.ok) {
          alert("All bookings reset successfully");
          fetchBookings();
        } else {
          alert("Failed to reset bookings");
        }
      } catch (err) {
        alert("Network error while resetting bookings");
        console.error(err);
      }
    }
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
          <h2 className="text-lg font-bold text-purple-700">
            Booking Management
          </h2>
          <div className="w-6"></div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-700">
              Booking Management
            </h1>
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded text-sm sm:text-base whitespace-nowrap"
            >
              ← Back to Admin Panel
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilter("Pending")}
                className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                  filter === "Pending"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("Approved")}
                className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                  filter === "Approved"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter("Rejected")}
                className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                  filter === "Rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setFilter("")}
                className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                  filter === "" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                All
              </button>
            </div>
            <button
              onClick={handleResetBookings}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 sm:px-4 py-2 rounded text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
            >
              Reset All Bookings
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow">
              <p className="text-lg font-semibold mb-2">
                No {filter || "All"} bookings found
              </p>
              <p className="text-sm text-gray-500">
                {filter === "Pending" &&
                  "There are no pending booking requests at the moment."}
                {filter === "Approved" && "No bookings have been approved yet."}
                {filter === "Rejected" && "No bookings have been rejected yet."}
                {!filter && "No bookings exist in the system yet."}
              </p>
            </div>
          ) : (
            <div>
              {/* ADDED: Display current filter category for clarity */}
              <div className="mb-4 p-3 bg-white rounded-lg shadow">
                <p className="text-sm font-semibold text-gray-700">
                  Showing:{" "}
                  <span
                    className={`${
                      filter === "Pending"
                        ? "text-purple-600"
                        : filter === "Approved"
                        ? "text-green-600"
                        : filter === "Rejected"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {filter || "All"} Bookings
                  </span>{" "}
                  ({bookings.length} total)
                </p>
              </div>
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
                        Dept
                      </th>
                      <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                        Reason
                      </th>
                      <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                        Status
                      </th>
                      <th className="p-2 sm:p-3 border text-xs sm:text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                          {booking.room}
                        </td>
                        <td className="p-2 sm:p-3 border text-center text-xs sm:text-sm">
                          {new Date(booking.date).toLocaleDateString()}
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
                        <td className="p-2 sm:p-3 border text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status} ({booking.facultyName})
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 border text-center space-y-2">
                          {booking.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(booking._id, "Approved")
                                }
                                className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-green-700 text-xs sm:text-sm w-full sm:w-auto"
                              >
                                Approve
                              </button>
                              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                                <select
                                  className="border px-2 py-1 rounded text-xs sm:text-sm flex-1"
                                  value={rejectionReason[booking._id] || ""}
                                  onChange={(e) =>
                                    setRejectionReason({
                                      ...rejectionReason,
                                      [booking._id]: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select reason</option>
                                  {predefinedReasons.map((r, i) => (
                                    <option key={i} value={r}>
                                      {r}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() =>
                                    updateStatus(
                                      booking._id,
                                      "Rejected",
                                      rejectionReason[booking._id]
                                    )
                                  }
                                  disabled={!rejectionReason[booking._id]}
                                  className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 text-xs sm:text-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            </>
                          )}
                          {booking.status === "Approved" &&
                            !isBookingExpired(booking) && (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    booking._id,
                                    "Rejected",
                                    "Manual cancellation"
                                  )
                                }
                                className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 text-xs sm:text-sm w-full sm:w-auto"
                              >
                                Cancel
                              </button>
                            )}
                          {booking.status === "Approved" &&
                            isBookingExpired(booking) && (
                              <span className="text-gray-500 text-xs sm:text-sm italic">
                                Completed
                              </span>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
