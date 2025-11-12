import React, { useEffect, useState, useRef } from "react";
import {
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaDoorOpen,
  FaFlask,
  FaChevronDown,
  FaUserCircle,
  FaHistory,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import NotificationBell from "./NotificationBell";

const allRooms = [
  // ===== GROUND FLOOR - Theory/Class Rooms (E0xx) =====
  { id: 1, name: "E003", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 2, name: "E004", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 3, name: "E005", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 4, name: "E006", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 5, name: "E012 & E013", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 6, name: "E032", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 7, name: "E033", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 8, name: "E035", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 9, name: "E036", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 10, name: "E037", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 11, name: "E038", type: "Theory", color: "bg-[#3B82F6]/20" },

  // ===== FIRST FLOOR - Theory/Class Rooms (E1xx) =====
  { id: 19, name: "E104", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 20, name: "E105", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 21, name: "E106", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 22, name: "E107", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 23, name: "E113 & E114", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 24, name: "E138", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 25, name: "E139", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 26, name: "E140", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 27, name: "E141", type: "Theory", color: "bg-[#3B82F6]/20" },

  // ===== GROUND FLOOR - Labs (E0xx) =====
  { id: 12, name: "E001", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 13, name: "E002", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 14, name: "E014 & E015", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 15, name: "E028", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 16, name: "E029", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 17, name: "E030 & E031", type: "Lab", color: "bg-[#60A5FA]/20" },

  // ===== FIRST FLOOR - Labs (E1xx) =====
  { id: 28, name: "E101", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 29, name: "E102", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 30, name: "E103", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 31, name: "E115 & E116", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 32, name: "E130", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 33, name: "E131", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 34, name: "E134", type: "Lab", color: "bg-[#60A5FA]/20" },
];

const timeSlots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-12:40",
  "12:00-1:00",
  "12:40-1:40",
  "1:40-2:40",
  "2:40-3:40",
  "3:40-4:40",
];

// Define overlapping slots that cannot be selected together
const overlappingSlots = {
  "12:00-12:40": ["12:00-1:00"],
  "12:00-1:00": ["12:00-12:40", "12:40-1:40"],
  "12:40-1:40": ["12:00-1:00"],
};

const facultyList = [
  "Dr. Vadlana Baby",
  "Dr. Cherukuri Kiran Mai",
  "Dr. Sabbineni Nagini",
  "Dr. Bolneni Venkata Kiranmayee",
  "Dr. Gollapudi Rameshchandra",
  "Dr. Puligundla Neelakantan",
  "Dr. Myneni Madhu Bala",
  "Dr. Malige Gangappa",
  "Dr. Pasupuleti Venkata Siva Kumar",
  "Dr. Annapu Reddy Brahmananda Reddy",
  "Dr. Deepak Sukheja",
  "Dr.Thayyaba Khatoon MD",
  "Dr. Anjusha Nitin Pimpalshende",
  "Dr. Motupalli Ravi Kanth",
  "Dr. Nekkanti Venkata Sailaja",
  "Dr. Desapandya Naga Vasundara",
  "Dr. Vasavi Ravuri",
  "Dr. Redrowthu Vijaya Saraswathi",
  "Dr. Kanakala Srinivas",
  "Mrs. Alli Madhavi",
  "Dr Pathi Radhika",
  "Mr.Thuraka Gnana Prakash",
  "Mrs.Somavarapu Jahnavi",
  "Mrs.Neerukonda Lakshmi Kalyani",
  "Dr. N. Sandeep Chaitanya",
  "Mrs. Nyaramneni Sarika",
  "Dr. Potluri Tejaswi",
  "Dr. Pokuri Bharath Kumar Chowdary",
  "Mr. Peddarapu Ramakrishna Chowdary",
  "Dr. Kunka Bheemalingappa",
  "Mrs.Lingineni Indira",
  "Dr. Chalumuru Suresh",
  "Dr Kriti Ohri",
  "Dr. Venkata Ramana Kaneti",
  "Mrs.K Jhansi Lakshmi Bai",
  "Mr. Mannepalli Venkata Krishna Rao",
  "Mr.Tummala Nagarjuna",
  "Mrs.Siripurapu Nyemeesha",
  "Mrs.Putti Jyothi",
  "Mrs. Bhagya Rekha Konkepudi",
  "Shaik Abdul Hameed",
  "Mrs.Pabba Prasanna",
  "Mrs.Gopisetti Laxmi Deepthi",
  "Mrs.Kodali Hari priya",
  "Mrs.Sadula Sudeshna",
  "Mr. Pinapati Sudheer Benarji",
  "Mr.Indurthi Ravindra Kumar",
  "Dr.Manchikatla Srikanth",
  "Mr.Perunalla Praveen",
  "Mrs.Chappidi Sandhya Rani",
  "Mrs.Vijaya Bhasakara Reddy V",
  "Mr.Ch. Suresh Kumar Raju",
  "Mr.P. Rajesh",
  "Sk. Saddam Hussain",
  "Mr.M. Ram Babu",
  "Mrs.V. Dhanalakshmi",
  "Mrs.A. Katyayani",
  "Mr. Palakurthi Ramesh",
  "Dr. Karumuri Sri Rama Murthy",
  "Mr.Thirupathi Nanuvala",
  "Mr.Karnam Akhil",
  "Ms.Smapath Alankritha",
  "Mrs.Swathi Kadari",
  "Mr.N. Praveen Kumar",
  "Mrs.Abbi Sandhya Rani",
  "Mrs.Shetkar Ambika",
  "Mr.Somanadha Satyadev Bulusu",
  "Mrs.Srijita Majumder",
  "Mrs.G. Dhruva Manasa",
  "Dr. A. V. S. Swetha",
  "Inayath Sana",
  "Malle Sandeep",
];

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Get today's date in consistent format (YYYY-MM-DD in local timezone)
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get initial selected date (skip Sunday)
  const getInitialDate = () => {
    const now = new Date();
    // If today is Sunday (0), move to Monday (next day)
    if (now.getDay() === 0) {
      now.setDate(now.getDate() + 1);
    }
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [activeTab, setActiveTab] = useState("Rooms");
  const [selectedFloor, setSelectedFloor] = useState("Ground"); // Default to Ground floor
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(facultyList[0]);
  const [selectedSlots, setSelectedSlots] = useState([]); // NEW: Track multiple selected slots
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [facultySearch, setFacultySearch] = useState("");
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [selectedAcademicDetails, setSelectedAcademicDetails] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [toastNotifications, setToastNotifications] = useState([]);

  const dropdownRef = useRef(null);
  const facultyDropdownRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [academicSlots, setAcademicSlots] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);

  // Function to show toast notification
  const showToast = (message, type) => {
    const id = Date.now();
    setToastNotifications((prev) => [...prev, { id, message, type }]);

    // Auto remove after 8 seconds
    setTimeout(() => {
      setToastNotifications((prev) => prev.filter((toast) => toast.id !== id));
    }, 8000);
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();

      // Check for status changes (only for current user's bookings)
      setPreviousBookings((prev) => {
        if (prev.length > 0) {
          data.forEach((booking) => {
            if (booking.email === user.email) {
              const oldBooking = prev.find((b) => b._id === booking._id);
              if (oldBooking && oldBooking.status !== booking.status) {
                // Status changed - show toast
                console.log(
                  `🔔 Status changed for booking ${booking._id}: ${oldBooking.status} → ${booking.status}`
                );
                if (booking.status === "Approved") {
                  showToast(
                    `✅ Your booking for ${booking.room} on ${new Date(
                      booking.date
                    ).toLocaleDateString()} has been approved!`,
                    "success"
                  );
                } else if (booking.status === "Rejected") {
                  showToast(
                    `❌ Your booking for ${booking.room} on ${new Date(
                      booking.date
                    ).toLocaleDateString()} has been rejected.`,
                    "error"
                  );
                }
              }
            }
          });
        }
        return data; // Update previous bookings with current data
      });

      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchCalendar = async () => {
    const res = await fetch("http://localhost:5000/api/calendar/view-all");
    const data = await res.json();
    setAcademicSlots(data);
  };

  useEffect(() => {
    fetchBookings();
    fetchCalendar();

    // Poll for booking status changes every 5 seconds
    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (
        facultyDropdownRef.current &&
        !facultyDropdownRef.current.contains(event.target)
      ) {
        setShowFacultyDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const getUserBookings = () => {
    return bookings.filter((b) => b.email === user.email);
  };

  // Helper function to check if a time slot has expired
  const isSlotExpired = (slot) => {
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    // Reset time to midnight for date comparison
    today.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    // If selected date is in the past, all slots are expired
    if (selectedDateObj < today) {
      return true;
    }

    // If selected date is today, check the slot time
    if (selectedDateObj.getTime() === today.getTime()) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      // Parse the end time of the slot (handle both "9:00-10:00" and "9:00 - 10:00" formats)
      const endTimeStr = slot.split("-")[1];
      const cleanEndTime = endTimeStr.trim();

      let endHour, endMinute;
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

      // Convert to minutes for comparison
      const currentMinutes = currentHour * 60 + currentMinute;
      const endMinutes = endHour * 60 + endMinute;

      // If current time is past the end time, slot is expired
      return currentMinutes >= endMinutes;
    }

    // Future dates - not expired
    return false;
  };

  const formatSlotsDisplay = (slots) => {
    if (!slots || slots.length === 0) return "";
    if (slots.length === 1) return slots[0];

    const sortedSlots = [...slots].sort();
    const timeSlotsOrder = [
      "9:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-12:40",
      "12:00-1:00",
      "12:40-1:40",
      "1:40-2:40",
      "2:40-3:40",
      "3:40-4:40",
    ];

    const indices = sortedSlots.map((slot) => timeSlotsOrder.indexOf(slot));
    const allConsecutive = indices.every(
      (val, i, arr) => i === 0 || val === arr[i - 1] + 1
    );

    if (allConsecutive && sortedSlots.length > 1) {
      const startTime = sortedSlots[0].split(" - ")[0];
      const endTime = sortedSlots[sortedSlots.length - 1].split(" - ")[1];
      return `${startTime} - ${endTime}`;
    }

    return sortedSlots.join(", ");
  };

  const getSlotStatus = (slot) => {
    // Check if slot has expired
    if (isSlotExpired(slot)) {
      return "Expired";
    }

    const dayOfWeek = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const academicEntry = academicSlots.find(
      (entry) =>
        entry.day === dayOfWeek &&
        entry.slot === slot &&
        entry.room === selectedRoom?.name
    );
    if (academicEntry) {
      return {
        type: "Academic",
        details: academicEntry,
      };
    }

    // Updated to check slots array instead of single slot
    const slotBookings = bookings.filter(
      (b) =>
        b.slots?.includes(slot) &&
        b.room === selectedRoom?.name &&
        b.date === selectedDate
    );
    const approved = slotBookings.find((b) => b.status === "Approved");

    if (!slotBookings.length) return "Free";
    if (approved)
      return approved.email === user.email
        ? "Approved"
        : `Booked by ${approved.facultyName}`;
    return "Pending";
  };

  // Check if a slot is disabled due to overlap with selected slots OR booked overlapping slots
  const isSlotDisabledByOverlap = (slot) => {
    // Check if any selected slot overlaps with this slot
    const hasSelectedOverlap = selectedSlots.some((selectedSlot) => {
      const overlaps = overlappingSlots[selectedSlot] || [];
      return overlaps.includes(slot);
    });

    if (hasSelectedOverlap) return true;

    // Check if any BOOKED/APPROVED slot overlaps with this slot
    const bookedSlots = bookings
      .filter(
        (b) =>
          b.room === selectedRoom?.name &&
          b.date === selectedDate &&
          (b.status === "Approved" || b.status === "Pending")
      )
      .flatMap((b) => b.slots || []);

    // For each booked slot, check if it overlaps with the current slot
    const hasBookedOverlap = bookedSlots.some((bookedSlot) => {
      const overlaps = overlappingSlots[bookedSlot] || [];
      return overlaps.includes(slot) || bookedSlot === slot;
    });

    return hasBookedOverlap;
  };

  // NEW: Toggle slot selection with overlap detection (no alerts, visual only)
  const toggleSlotSelection = (slot) => {
    setSelectedSlots((prev) => {
      if (prev.includes(slot)) {
        // If slot is already selected, deselect it
        return prev.filter((s) => s !== slot);
      } else {
        // Check if the slot is disabled due to overlap
        const isDisabled = prev.some((selectedSlot) => {
          const overlaps = overlappingSlots[selectedSlot] || [];
          return overlaps.includes(slot);
        });

        // If disabled, don't select it (just ignore the click)
        if (isDisabled) {
          return prev;
        }

        // No overlap, add the slot
        return [...prev, slot];
      }
    });
  };

  // NEW: Calculate available slots for a room on selected date
  const getAvailableSlotCount = (roomName) => {
    const dayOfWeek = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });

    let availableCount = 0;

    timeSlots.forEach((slot) => {
      // Check if slot is blocked by academic calendar
      const academicBlocked = academicSlots.some(
        (entry) =>
          entry.day === dayOfWeek &&
          entry.slot === slot &&
          entry.room === roomName
      );

      if (academicBlocked) return; // Skip this slot

      // Check if slot is approved by someone
      const slotBookings = bookings.filter(
        (b) =>
          b.slots?.includes(slot) &&
          b.room === roomName &&
          b.date === selectedDate
      );
      const approved = slotBookings.find((b) => b.status === "Approved");

      if (!approved) {
        availableCount++; // This slot is free
      }
    });

    return availableCount;
  };

  // Updated to handle multiple slots
  const handleBookSlots = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot");
      return;
    }

    const reason = prompt("Enter the purpose of booking this room:");
    if (!reason) return;

    const booking = {
      date: selectedDate,
      room: selectedRoom.name,
      slots: selectedSlots, // Send array of slots
      reason,
      // REMOVED: Don't send status - let backend set default 'Pending'
      facultyName: user.name,
      email: user.email,
      department: user.department,
      staffNumber: user.staffNumber,
    };

    console.log("📤 Sending booking request:", booking);

    const res = await fetch("http://localhost:5000/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    if (res.ok) {
      alert(`Booking request sent for ${selectedSlots.length} slot(s)!`);
      setSelectedSlots([]); // Clear selection
      fetchBookings();
    } else {
      const error = await res.json();
      alert(error.message || "Booking failed");
    }
  };

  const renderFacultyView = () => {
    const dayOfWeek = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    return (
      <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
        {timeSlots.map((slot) => {
          const found = academicSlots.find(
            (entry) =>
              entry.day === dayOfWeek &&
              entry.slot === slot &&
              entry.faculty === selectedFaculty
          );

          const label = found
            ? `${found.type} for ${found.year} ${
                found.branch ? found.branch + " " : ""
              }${found.section} - ${found.subject}`
            : "Free";

          return (
            <div
              key={slot}
              className={`p-3 sm:p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 transition
              ${
                label === "Free"
                  ? "bg-[#1F2937] border-[#374151] text-[#9CA3AF]"
                  : "bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/30"
              }`}
            >
              <span className="font-semibold text-sm sm:text-base">{slot}</span>
              <span className="text-xs sm:text-sm break-words">{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const filteredRooms = allRooms.filter((room) => {
    // Filter by type (Rooms/Labs)
    let typeMatch = false;
    if (activeTab === "Rooms") typeMatch = room.type === "Theory";
    if (activeTab === "Labs") typeMatch = room.type === "Lab";

    if (!typeMatch) return false;

    // Filter by floor
    // Ground Floor: rooms starting with E0 (E001, E002, E003, etc.)
    if (selectedFloor === "Ground") {
      return room.name.startsWith("E0");
    }

    // First Floor: rooms starting with E1 (E101, E102, E138, etc.)
    if (selectedFloor === "First") {
      return room.name.startsWith("E1");
    }

    return true;
  });

  const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateValue = `${year}-${month}-${day}`;

    return {
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      }),
      value: dateValue,
      dayOfWeek: date.getDay(),
    };
  })
    .filter((day) => day.dayOfWeek !== 0)
    .slice(0, 7); // Filter out Sundays (0) and keep only 7 days

  return (
    <div className="min-h-screen px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#111827]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Classroom<span className="text-[#3B82F6]">Hub</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-sm flex items-center gap-2 text-[#9CA3AF] bg-[#1F2937] px-4 py-2 rounded-lg border border-[#374151]">
            <FaCalendarAlt className="text-[#3B82F6]" />{" "}
            {new Date().toLocaleDateString()}
          </span>

          {/* Booking History Button */}
          <button
            onClick={() => setShowBookingHistory(true)}
            className="text-sm flex items-center gap-2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-4 py-2 rounded-lg shadow-lg shadow-[#10B981]/50 hover:shadow-[#10B981]/70 transition-all transform hover:scale-105 font-medium"
          >
            <FaHistory />
            My Bookings
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="text-sm flex items-center gap-2 bg-[#1F2937] px-4 py-2 rounded-lg border border-[#374151] text-white font-medium hover:border-[#3B82F6] transition-all"
            >
              <FaUser className="text-[#3B82F6]" />
              {user.name}
              <FaChevronDown
                className={`text-[#9CA3AF] transition-transform ${
                  showUserDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1F2937] border border-[#374151] rounded-lg shadow-2xl shadow-black/50 overflow-hidden z-50">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-[#374151] transition-colors flex items-center gap-3"
                >
                  <FaUserCircle className="text-[#3B82F6]" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-[#374151] transition-colors flex items-center gap-3 border-t border-[#374151]"
                >
                  <FaSignOutAlt className="text-red-400" />
                  Logout
                </button>
              </div>
            )}
          </div>

          <NotificationBell userEmail={user.email} />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <NotificationBell userEmail={user.email} />
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white bg-[#1F2937] p-2 rounded-lg border border-[#374151] hover:border-[#3B82F6] transition-all"
          >
            {showMobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden mb-6 bg-[#1F2937] border border-[#374151] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#374151] flex items-center gap-2 text-white">
            <FaUser className="text-[#3B82F6]" />
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="px-4 py-2 text-xs text-[#9CA3AF] flex items-center gap-2 border-b border-[#374151]">
            <FaCalendarAlt className="text-[#3B82F6]" />
            {new Date().toLocaleDateString()}
          </div>
          <button
            onClick={() => {
              setShowProfileModal(true);
              setShowMobileMenu(false);
            }}
            className="w-full px-4 py-3 text-left text-white hover:bg-[#374151] transition-colors flex items-center gap-3 border-b border-[#374151]"
          >
            <FaUserCircle className="text-[#3B82F6]" />
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-red-400 hover:bg-[#374151] transition-colors flex items-center gap-3"
          >
            <FaSignOutAlt className="text-red-400" />
            Logout
          </button>
        </div>
      )}

      {/* Date Selector */}
      <div className="mb-4 sm:mb-6">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-thin pb-3 px-2 sm:px-0 -mx-2 sm:mx-0">
          {days.map((day) => (
            <button
              key={day.value}
              onClick={() => {
                setSelectedDate(day.value);
                setSelectedRoom(null);
              }}
              className={`flex-shrink-0 min-w-[80px] sm:min-w-[100px] px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium shadow-lg transition-all transform hover:scale-105 whitespace-nowrap ${
                selectedDate === day.value
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-[#3B82F6]/50"
                  : "bg-[#1F2937] text-[#9CA3AF] border border-[#374151] hover:border-[#3B82F6]"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="inline-flex bg-[#1F2937] border border-[#374151] rounded-lg shadow-lg p-1 w-full sm:w-auto">
          {["Rooms", "Labs", "Faculty"].map((tab, idx) => (
            <button
              key={tab}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-md font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-[#3B82F6]/50"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setSelectedRoom(null);
              }}
            >
              {tab === "Rooms" && <FaDoorOpen className="text-xs sm:text-sm" />}
              {tab === "Labs" && <FaFlask className="text-xs sm:text-sm" />}
              <span className="hidden sm:inline">{tab}</span>
              <span className="sm:hidden">
                {tab === "Rooms"
                  ? "Rooms"
                  : tab === "Labs"
                  ? "Labs"
                  : "Faculty"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Floor Selector - Only show for Rooms and Labs tabs */}
      {activeTab !== "Faculty" && (
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex bg-[#1F2937] border border-[#374151] rounded-lg shadow-lg p-1 w-full sm:w-auto max-w-md">
            {["Ground", "First"].map((floor) => (
              <button
                key={floor}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-md font-medium text-xs sm:text-sm transition-all ${
                  selectedFloor === floor
                    ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg shadow-[#10B981]/50"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
                onClick={() => {
                  setSelectedFloor(floor);
                  setSelectedRoom(null);
                }}
              >
                {floor === "Ground" && "Ground Floor"}
                {floor === "First" && "1st Floor"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Faculty View */}
      {activeTab === "Faculty" ? (
        <div className="max-w-2xl mx-auto px-2 sm:px-0">
          <div className="relative mb-4 sm:mb-6" ref={facultyDropdownRef}>
            <input
              type="text"
              placeholder="Search faculty..."
              value={showFacultyDropdown ? facultySearch : selectedFaculty}
              onChange={(e) => {
                setFacultySearch(e.target.value);
                setShowFacultyDropdown(true);
              }}
              onFocus={() => {
                setFacultySearch("");
                setShowFacultyDropdown(true);
              }}
              className="w-full bg-[#1F2937] border border-[#374151] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
            />
            {showFacultyDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-[#1F2937] border border-[#374151] rounded-lg max-h-60 overflow-y-auto shadow-lg">
                {facultyList
                  .filter((f) =>
                    f.toLowerCase().includes(facultySearch.toLowerCase())
                  )
                  .map((faculty, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedFaculty(faculty);
                        setShowFacultyDropdown(false);
                        setFacultySearch("");
                      }}
                      className="px-3 sm:px-4 py-2 hover:bg-[#374151] cursor-pointer text-white text-sm sm:text-base transition"
                    >
                      {faculty}
                    </div>
                  ))}
              </div>
            )}
          </div>
          {renderFacultyView()}
        </div>
      ) : (
        <>
          {/* Room/Lab Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 mb-6 sm:mb-10">
            {filteredRooms.map((room) => {
              // Determine capacity for labs only
              let capacity = null;
              if (room.type === "Lab") {
                // Check if it's a combined lab (contains "Combined", +, or &)
                const isCombined =
                  room.name.toLowerCase().includes("combined") ||
                  room.name.includes("+") ||
                  room.name.includes("&");
                capacity = isCombined ? 80 : 40;
              }

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`cursor-pointer px-2 sm:px-3 py-3 sm:py-4 rounded-lg border transition-all transform hover:scale-105 text-center shadow-lg ${
                    selectedRoom?.id === room.id
                      ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-[#3B82F6]/50 ring-2 ring-[#60A5FA]"
                      : "bg-[#1F2937] border-[#374151] text-white hover:border-[#3B82F6]"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold truncate">
                    {room.name}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#9CA3AF] mt-1">
                    {room.type}
                  </div>
                  {/* Show capacity only for labs */}
                  {capacity && (
                    <div
                      className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-semibold ${
                        selectedRoom?.id === room.id
                          ? "text-white"
                          : "text-[#3B82F6]"
                      }`}
                    >
                      Capacity: {capacity}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Time Slots Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4">
          <div className="bg-[#1F2937] border border-[#374151] shadow-2xl p-4 sm:p-6 lg:p-8 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] rounded-full"></span>
                <span className="truncate">
                  Slots for {selectedRoom.name} on {selectedDate}
                </span>
              </h2>
              <button
                onClick={() => {
                  setSelectedRoom(null);
                  setSelectedSlots([]);
                }}
                className="text-[#9CA3AF] hover:text-white text-2xl transition-all hover:rotate-90 duration-300"
              >
                ✖
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              {selectedSlots.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm text-[#9CA3AF]">
                    {selectedSlots.length} slot
                    {selectedSlots.length > 1 ? "s" : ""} selected
                  </span>
                  <button
                    onClick={handleBookSlots}
                    className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-lg shadow-[#3B82F6]/50 transition-all transform hover:scale-105"
                  >
                    Book
                  </button>
                  <button
                    onClick={() => setSelectedSlots([])}
                    className="bg-[#374151] hover:bg-[#4B5563] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4">
              {timeSlots.map((slot) => {
                const status = getSlotStatus(slot);
                const isAcademic =
                  typeof status === "object" && status.type === "Academic";
                const statusText = isAcademic ? "Academic Class" : status;
                const isSelected = selectedSlots.includes(slot);
                const isFree = statusText === "Free";
                const isExpired = statusText === "Expired";
                const isDisabledByOverlap = isSlotDisabledByOverlap(slot);

                let bgClass = "";
                if (isExpired) {
                  bgClass =
                    "bg-[#6B7280] text-[#D1D5DB] cursor-not-allowed opacity-60";
                } else if (isAcademic) {
                  bgClass =
                    "bg-purple-600 text-white shadow-purple-600/50 cursor-pointer";
                } else if (isDisabledByOverlap && isFree) {
                  // Overlapping slot - grayed out and disabled
                  bgClass =
                    "bg-[#374151] text-[#6B7280] cursor-not-allowed opacity-50 border-2 border-[#4B5563]";
                } else if (isSelected && isFree) {
                  bgClass =
                    "bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-[#3B82F6]/50 ring-4 ring-[#60A5FA] scale-105";
                } else if (isFree) {
                  bgClass =
                    "bg-[#1F2937] hover:bg-[#374151] text-white border-2 border-[#3B82F6] hover:border-[#60A5FA]";
                } else if (statusText === "Pending") {
                  bgClass = "bg-yellow-500 text-yellow-900 border-yellow-600";
                } else if (
                  statusText.startsWith("Approved") ||
                  statusText === "Approved"
                ) {
                  bgClass = "bg-green-600 text-white shadow-green-600/50";
                } else if (statusText.startsWith("Blocked")) {
                  bgClass = "bg-[#374151] text-[#9CA3AF] cursor-not-allowed";
                } else {
                  bgClass = "bg-red-600 text-white shadow-red-600/50";
                }

                return (
                  <div
                    key={slot}
                    className={`p-3 sm:p-5 rounded-lg text-center transition-all font-semibold shadow-lg transform ${bgClass} ${
                      isFree && !isExpired && !isDisabledByOverlap
                        ? "cursor-pointer"
                        : isAcademic
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (isAcademic) {
                        setSelectedAcademicDetails(status.details);
                        setShowAcademicModal(true);
                      } else if (isFree && !isExpired && !isDisabledByOverlap) {
                        toggleSlotSelection(slot);
                      }
                    }}
                  >
                    <div className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2">
                      {isFree && !isExpired && !isDisabledByOverlap && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-3 h-3 sm:w-4 sm:h-4 accent-[#3B82F6]"
                        />
                      )}
                      {slot}
                    </div>
                    <div className="text-[10px] sm:text-xs mt-1 sm:mt-2 font-normal">
                      {isAcademic ? (
                        <>
                          <div>{statusText}</div>
                          <div className="mt-1 text-purple-200 truncate">
                            {status.details.subject}
                          </div>
                          <div className="text-purple-200 truncate">
                            {status.details.year}{" "}
                            {status.details.branch
                              ? status.details.branch + " "
                              : ""}
                            {status.details.section}
                          </div>
                        </>
                      ) : isDisabledByOverlap && isFree ? (
                        <>
                          <div>Overlaps</div>
                          <div className="text-[10px]">🚫 Can't select</div>
                        </>
                      ) : (
                        statusText
                      )}
                    </div>
                    {isSelected && (
                      <div className="text-[10px] sm:text-xs mt-1">
                        ✓ Selected
                      </div>
                    )}
                    {isAcademic && (
                      <div className="text-[10px] sm:text-xs mt-1">
                        🔒 Click for details
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedSlots.length > 0 && (
              <div className="mt-6 p-4 bg-[#374151] rounded-lg">
                <p className="text-sm text-white font-semibold mb-2">
                  Selected Slots:
                </p>
                <p className="text-[#9CA3AF]">
                  {selectedSlots.sort().join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-[#1F2937] rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 lg:p-8 border border-[#374151] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                <FaUserCircle className="text-[#3B82F6] text-xl sm:text-2xl" />
                Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[#9CA3AF] hover:text-white text-xl sm:text-2xl transition"
              >
                ✖
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-xs sm:text-sm">Name</p>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {user.name}
                </p>
              </div>
              <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-xs sm:text-sm">Email</p>
                <p className="text-white font-semibold text-sm sm:text-base break-all">
                  {user.email}
                </p>
              </div>
              <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-xs sm:text-sm">Department</p>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {user.department}
                </p>
              </div>
              <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-xs sm:text-sm">
                  Staff Number
                </p>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {user.staffNumber}
                </p>
              </div>
              {user.phone && (
                <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                  <p className="text-[#9CA3AF] text-xs sm:text-sm">Phone</p>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {user.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking History Modal */}
      {showBookingHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 sm:p-4">
          <div className="bg-[#1F2937] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#374151]">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#374151]">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                <FaHistory className="text-[#3B82F6] text-lg sm:text-xl" />
                My Booking History
              </h2>
              <button
                onClick={() => setShowBookingHistory(false)}
                className="text-[#9CA3AF] hover:text-white text-xl sm:text-2xl transition"
              > 
                ✖
              </button>
            </div>
            <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {getUserBookings().length === 0 ? (
                <div className="text-center py-12">
                  <FaHistory className="text-6xl text-[#374151] mx-auto mb-4" />
                  <p className="text-[#9CA3AF] text-lg">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {getUserBookings().map((booking) => {
                    // Debug: Log booking data
                    console.log("📋 Booking data:", {
                      id: booking._id,
                      room: booking.room,
                      status: booking.status,
                      appliedBy: booking.appliedBy,
                      appliedByEmail: booking.appliedByEmail,
                      approvedBy: booking.approvedBy,
                      approvedByEmail: booking.approvedByEmail,
                    });

                    return (
                      <div
                        key={booking._id}
                        className="bg-[#111827] p-3 sm:p-5 rounded-lg border border-[#374151] hover:border-[#3B82F6] transition-all"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base sm:text-lg truncate">
                              {booking.room}
                            </h3>
                            <p className="text-[#9CA3AF] text-xs sm:text-sm">
                              {new Date(booking.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                              booking.status === "Approved"
                                ? "bg-green-600 text-white"
                                : booking.status === "Rejected"
                                ? "bg-red-600 text-white"
                                : "bg-yellow-500 text-yellow-900"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                          <div className="bg-[#1F2937] p-2 sm:p-3 rounded border border-[#374151]">
                            <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                              Time Slot(s)
                            </p>
                            <p className="text-white font-semibold text-xs sm:text-sm">
                              {formatSlotsDisplay(
                                booking.slots || [booking.slot]
                              )}
                            </p>
                          </div>
                          <div className="bg-[#1F2937] p-2 sm:p-3 rounded border border-[#374151]">
                            <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                              Booked On
                            </p>
                            <p className="text-white font-semibold text-xs sm:text-sm">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                          <div className="bg-[#1F2937] p-2 sm:p-3 rounded border border-[#374151]">
                            <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                              Applied By
                            </p>
                            <p className="text-white font-semibold text-xs sm:text-sm">
                              {booking.appliedBy || booking.facultyName}
                            </p>
                            {booking.appliedByEmail && (
                              <p className="text-[#9CA3AF] text-[10px] mt-1">
                                {booking.appliedByEmail}
                              </p>
                            )}
                          </div>
                          <div className="bg-[#1F2937] p-2 sm:p-3 rounded border border-[#374151]">
                            <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                              Approved By
                            </p>
                            <p className="text-white font-semibold text-xs sm:text-sm">
                              {booking.approvedBy || "-"}
                            </p>
                            {booking.approvedByEmail && (
                              <p className="text-[#9CA3AF] text-[10px] mt-1">
                                {booking.approvedByEmail}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="bg-[#1F2937] p-2 sm:p-3 rounded border border-[#374151]">
                          <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                            Reason
                          </p>
                          <p className="text-white text-xs sm:text-sm break-words">
                            {booking.reason}
                          </p>
                        </div>
                        {booking.status === "Rejected" &&
                          booking.rejectionReason && (
                            <div className="mt-2 sm:mt-3 bg-red-900/20 border border-red-900/50 p-2 sm:p-3 rounded">
                              <p className="text-red-400 text-[10px] sm:text-xs mb-1">
                                Rejection Reason
                              </p>
                              <p className="text-red-300 text-xs sm:text-sm break-words">
                                {booking.rejectionReason}
                              </p>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Academic Class Details Modal */}
      {showAcademicModal && selectedAcademicDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#1F2937] rounded-lg p-4 sm:p-6 max-w-md w-full border-2 border-purple-600 shadow-2xl shadow-purple-600/50 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Academic Class Details
              </h2>
              <button
                onClick={() => {
                  setShowAcademicModal(false);
                  setSelectedAcademicDetails(null);
                }}
                className="text-gray-400 hover:text-white transition text-xl sm:text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                  Subject
                </p>
                <p className="text-white font-bold text-base sm:text-lg break-words">
                  {selectedAcademicDetails.subject}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                  <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                    Type
                  </p>
                  <p className="text-white font-semibold text-xs sm:text-sm">
                    {selectedAcademicDetails.type}
                  </p>
                </div>
                <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                  <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                    Room
                  </p>
                  <p className="text-white font-semibold text-xs sm:text-sm truncate">
                    {selectedAcademicDetails.room}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                  <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                    Branch
                  </p>
                  <p className="text-white font-semibold text-xs sm:text-sm truncate">
                    {selectedAcademicDetails.branch || "N/A"}
                  </p>
                </div>
                <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                  <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                    Year
                  </p>
                  <p className="text-white font-semibold text-xs sm:text-sm">
                    {selectedAcademicDetails.year}
                  </p>
                </div>
                <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                  <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                    Section
                  </p>
                  <p className="text-white font-semibold text-xs sm:text-sm">
                    {selectedAcademicDetails.section}
                  </p>
                </div>
              </div>
              <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                  Faculty
                </p>
                <p className="text-white font-semibold text-xs sm:text-sm break-words">
                  {selectedAcademicDetails.faculty}
                </p>
              </div>
              <div className="bg-[#111827] p-3 sm:p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-[10px] sm:text-xs mb-1">
                  Time Slot
                </p>
                <p className="text-white font-semibold text-xs sm:text-sm">
                  {selectedAcademicDetails.slot}
                </p>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/50 p-3 sm:p-4 rounded-lg">
                <p className="text-purple-300 text-xs sm:text-sm">
                  🔒 This slot is blocked for academic purposes and cannot be
                  booked.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowAcademicModal(false);
                setSelectedAcademicDetails(null);
              }}
              className="mt-4 sm:mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications - WhatsApp Style */}
      <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2">
        {toastNotifications.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border animate-slideIn ${
              toast.type === "success"
                ? "bg-green-600 border-green-500 text-white"
                : "bg-red-600 border-red-500 text-white"
            }`}
            style={{
              animation: "slideIn 0.3s ease-out",
              minWidth: "300px",
              maxWidth: "400px",
            }}
          >
            <div className="text-sm font-medium">{toast.message}</div>
            <button
              onClick={() =>
                setToastNotifications((prev) =>
                  prev.filter((t) => t.id !== toast.id)
                )
              }
              className="ml-auto text-white hover:text-gray-200 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
