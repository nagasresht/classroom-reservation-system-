import React, { useEffect, useState, useRef } from 'react';
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaDoorOpen, FaFlask, FaChevronDown, FaUserCircle, FaHistory } from 'react-icons/fa';
import NotificationBell from './NotificationBell';

const allRooms = [
  // Theory/Class Rooms
  { id: 1, name: "E003", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 2, name: "E004", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 3, name: "E005", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 4, name: "E006", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 5, name: "E012 & E013", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 6, name: "E032", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 7, name: "E033", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 8, name: "E034 (Audi)", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 9, name: "E035", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 10, name: "E036", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 11, name: "E037", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 12, name: "E038", type: "Theory", color: "bg-[#3B82F6]/20" },
  
  // Labs
  { id: 13, name: "E001", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 14, name: "E002", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 15, name: "E014 & E015", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 16, name: "E028", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 17, name: "E029", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 18, name: "E030 & E031", type: "Lab", color: "bg-[#60A5FA]/20" }
];

const timeSlots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-1:40",
  "1:40-2:40",
  "2:40-3:40",
  "3:40-4:40"
];

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
  "Malle Sandeep"
];

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("Rooms");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(facultyList[0]);
  const [selectedSlots, setSelectedSlots] = useState([]); // NEW: Track multiple selected slots
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [facultySearch, setFacultySearch] = useState('');
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const facultyDropdownRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [academicSlots, setAcademicSlots] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  const fetchCalendar = async () => {
    const res = await fetch("http://localhost:5000/api/calendar/view-all");
    const data = await res.json();
    setAcademicSlots(data);
  };

  useEffect(() => {
    fetchBookings();
    fetchCalendar();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (facultyDropdownRef.current && !facultyDropdownRef.current.contains(event.target)) {
        setShowFacultyDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const getUserBookings = () => {
    return bookings.filter(b => b.email === user.email);
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
      const endTimeStr = slot.split('-')[1];
      const cleanEndTime = endTimeStr.trim();
      
      let endHour, endMinute;
      if (cleanEndTime.includes(':')) {
        const parts = cleanEndTime.split(':');
        endHour = parseInt(parts[0]);
        endMinute = parseInt(parts[1]);
      } else {
        endHour = parseInt(cleanEndTime);
        endMinute = 0;
      }
      
      // Handle PM times (afternoon slots)
      if (endHour < 9 && !cleanEndTime.toLowerCase().includes('am')) {
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
    if (!slots || slots.length === 0) return '';
    if (slots.length === 1) return slots[0];
    
    const sortedSlots = [...slots].sort();
    const timeSlots = [
      "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:40",
      "1:40-2:40", "2:40-3:40", "3:40-4:40"
    ];
    
    const indices = sortedSlots.map(slot => timeSlots.indexOf(slot));
    const allConsecutive = indices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
    
    if (allConsecutive && sortedSlots.length > 1) {
      const startTime = sortedSlots[0].split(' - ')[0];
      const endTime = sortedSlots[sortedSlots.length - 1].split(' - ')[1];
      return `${startTime} - ${endTime}`;
    }
    
    return sortedSlots.join(', ');
  };

  const getSlotStatus = (slot) => {
    // Check if slot has expired
    if (isSlotExpired(slot)) {
      return "Expired";
    }

    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const academicBlocked = academicSlots.some(entry =>
      entry.day === dayOfWeek &&
      entry.slot === slot &&
      entry.room === selectedRoom?.name
    );
    if (academicBlocked) return "Blocked (Academic)";

    // Updated to check slots array instead of single slot
    const slotBookings = bookings.filter(
      (b) => b.slots?.includes(slot) && b.room === selectedRoom?.name && b.date === selectedDate
    );
    const approved = slotBookings.find(b => b.status === "Approved");

    if (!slotBookings.length) return "Free";
    if (approved) return approved.email === user.email ? "Approved" : `Booked by ${approved.facultyName}`;
    return "Pending";
  };

  // NEW: Toggle slot selection
  const toggleSlotSelection = (slot) => {
    setSelectedSlots(prev => {
      if (prev.includes(slot)) {
        return prev.filter(s => s !== slot);
      } else {
        return [...prev, slot];
      }
    });
  };

  // NEW: Calculate available slots for a room on selected date
  const getAvailableSlotCount = (roomName) => {
    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    
    let availableCount = 0;
    
    timeSlots.forEach(slot => {
      // Check if slot is blocked by academic calendar
      const academicBlocked = academicSlots.some(entry =>
        entry.day === dayOfWeek &&
        entry.slot === slot &&
        entry.room === roomName
      );
      
      if (academicBlocked) return; // Skip this slot
      
      // Check if slot is approved by someone
      const slotBookings = bookings.filter(
        (b) => b.slots?.includes(slot) && b.room === roomName && b.date === selectedDate
      );
      const approved = slotBookings.find(b => b.status === "Approved");
      
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
      staffNumber: user.staffNumber
    };

    console.log('📤 Sending booking request:', booking);

    const res = await fetch("http://localhost:5000/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
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
    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    return (
      <div className="mt-6 space-y-3">
        {timeSlots.map(slot => {
          const found = academicSlots.find(entry =>
            entry.day === dayOfWeek &&
            entry.slot === slot &&
            entry.faculty === selectedFaculty
          );

          const label = found
            ? `${found.type} for ${found.year} ${found.section} - ${found.subject}`
            : "Free";

          return (
            <div key={slot} className={`p-4 rounded-lg border flex justify-between items-center transition
              ${label === "Free" ? 'bg-[#1F2937] border-[#374151] text-[#9CA3AF]' : 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/30'}`}>
              <span className="font-semibold">{slot}</span>
              <span className="text-sm">{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const filteredRooms = allRooms.filter(room => {
    if (activeTab === "Rooms") return room.type === "Theory";
    if (activeTab === "Labs") return room.type === "Lab";
    return false;
  });

  const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      value: date.toISOString().split('T')[0],
      dayOfWeek: date.getDay()
    };
  }).filter(day => day.dayOfWeek !== 0).slice(0, 7); // Filter out Sundays (0) and keep only 7 days

  return (
    <div className="min-h-screen px-6 py-6 bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#111827]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">
            Classroom<span className="text-[#3B82F6]">Hub</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm flex items-center gap-2 text-[#9CA3AF] bg-[#1F2937] px-4 py-2 rounded-lg border border-[#374151]">
            <FaCalendarAlt className="text-[#3B82F6]" /> {new Date().toLocaleDateString()}
          </span>
          
          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="text-sm flex items-center gap-2 bg-[#1F2937] px-4 py-2 rounded-lg border border-[#374151] text-white font-medium hover:border-[#3B82F6] transition-all"
            >
              <FaUser className="text-[#3B82F6]" /> 
              {user.name}
              <FaChevronDown className={`text-[#9CA3AF] transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
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
                  onClick={() => {
                    setShowBookingHistory(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-[#374151] transition-colors flex items-center gap-3 border-t border-[#374151]"
                >
                  <FaHistory className="text-[#3B82F6]" />
                  Booking History
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
      </div>

      {/* Date Selector */}
      <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day.value}
            onClick={() => {
              setSelectedDate(day.value);
              setSelectedRoom(null);
            }}
            className={`px-6 py-3 rounded-lg text-sm font-medium shadow-lg transition-all transform hover:scale-105 ${
              selectedDate === day.value
                ? "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-[#3B82F6]/50"
                : "bg-[#1F2937] text-[#9CA3AF] border border-[#374151] hover:border-[#3B82F6]"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-[#1F2937] border border-[#374151] rounded-lg shadow-lg p-1">
          {["Rooms", "Labs", "Faculty"].map((tab, idx) => (
            <button
              key={tab}
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === tab 
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-[#3B82F6]/50" 
                  : "text-[#9CA3AF] hover:text-white"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setSelectedRoom(null);
              }}
            >
              {tab === "Rooms" && <FaDoorOpen />}
              {tab === "Labs" && <FaFlask />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty View */}
      {activeTab === "Faculty" ? (
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-6" ref={facultyDropdownRef}>
            <input
              type="text"
              placeholder="Search faculty..."
              value={showFacultyDropdown ? facultySearch : selectedFaculty}
              onChange={(e) => {
                setFacultySearch(e.target.value);
                setShowFacultyDropdown(true);
              }}
              onFocus={() => {
                setFacultySearch('');
                setShowFacultyDropdown(true);
              }}
              className="w-full bg-[#1F2937] border border-[#374151] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
            />
            {showFacultyDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-[#1F2937] border border-[#374151] rounded-lg max-h-60 overflow-y-auto shadow-lg">
                {facultyList
                  .filter(f => f.toLowerCase().includes(facultySearch.toLowerCase()))
                  .map((faculty, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedFaculty(faculty);
                        setShowFacultyDropdown(false);
                        setFacultySearch('');
                      }}
                      className="px-4 py-2 hover:bg-[#374151] cursor-pointer text-white transition"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mb-10">
            {filteredRooms.map((room) => {
              const availableSlots = getAvailableSlotCount(room.name);
              const totalSlots = timeSlots.length;
              
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`cursor-pointer px-3 py-4 rounded-lg border transition-all transform hover:scale-105 text-center shadow-lg ${
                    selectedRoom?.id === room.id 
                      ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-[#3B82F6]/50 ring-2 ring-[#60A5FA]" 
                      : "bg-[#1F2937] border-[#374151] text-white hover:border-[#3B82F6]"
                  }`}
                >
                  <div className="text-sm font-bold truncate">{room.name}</div>
                  <div className="text-xs text-[#9CA3AF] mt-1">{room.type}</div>
                  {/* Available Slots Count */}
                  <div className={`text-xs mt-2 font-semibold ${
                    selectedRoom?.id === room.id ? 'text-white' : 'text-[#3B82F6]'
                  }`}>
                    {availableSlots}/{totalSlots} slots
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          {selectedRoom && (
            <div className="bg-[#1F2937] border border-[#374151] shadow-2xl p-8 rounded-2xl max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] rounded-full"></span>
                  Slots for {selectedRoom.name} on {selectedDate}
                </h2>
                {selectedSlots.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#9CA3AF]">
                      {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={handleBookSlots}
                      className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-[#3B82F6]/50 transition-all transform hover:scale-105"
                    >
                      Book Selected
                    </button>
                    <button
                      onClick={() => setSelectedSlots([])}
                      className="bg-[#374151] hover:bg-[#4B5563] text-white px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {timeSlots.map(slot => {
                  const status = getSlotStatus(slot);
                  const isSelected = selectedSlots.includes(slot);
                  const isFree = status === "Free";
                  const isExpired = status === "Expired";
                  
                  let bgClass = "";
                  if (isExpired) {
                    bgClass = "bg-[#6B7280] text-[#D1D5DB] cursor-not-allowed opacity-60";
                  } else if (isSelected && isFree) {
                    bgClass = "bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-[#3B82F6]/50 ring-4 ring-[#60A5FA] scale-105";
                  } else if (isFree) {
                    bgClass = "bg-[#1F2937] hover:bg-[#374151] text-white border-2 border-[#3B82F6] hover:border-[#60A5FA]";
                  } else if (status === "Pending") {
                    bgClass = "bg-yellow-500 text-yellow-900 border-yellow-600";
                  } else if (status.startsWith("Approved") || status === "Approved") {
                    bgClass = "bg-green-600 text-white shadow-green-600/50";
                  } else if (status.startsWith("Blocked")) {
                    bgClass = "bg-[#374151] text-[#9CA3AF] cursor-not-allowed";
                  } else {
                    bgClass = "bg-red-600 text-white shadow-red-600/50";
                  }

                  return (
                    <div
                      key={slot}
                      className={`p-5 rounded-lg text-center transition-all font-semibold shadow-lg transform ${bgClass} ${isFree && !isExpired ? "cursor-pointer" : "cursor-default"}`}
                      onClick={() => isFree && !isExpired && toggleSlotSelection(slot)}
                    >
                      <div className="text-sm flex items-center justify-center gap-2">
                        {isFree && !isExpired && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#3B82F6]"
                          />
                        )}
                        {slot}
                      </div>
                      <div className="text-xs mt-2 font-normal">{status}</div>
                      {isSelected && <div className="text-xs mt-1">✓ Selected</div>}
                    </div>
                  );
                })}
              </div>
              {selectedSlots.length > 0 && (
                <div className="mt-6 p-4 bg-[#374151] rounded-lg">
                  <p className="text-sm text-white font-semibold mb-2">Selected Slots:</p>
                  <p className="text-[#9CA3AF]">{selectedSlots.sort().join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#1F2937] rounded-2xl shadow-2xl w-full max-w-md p-8 border border-[#374151]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaUserCircle className="text-[#3B82F6]" />
                Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[#9CA3AF] hover:text-white text-2xl transition"
              >
                ✖
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-[#111827] p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-sm">Name</p>
                <p className="text-white font-semibold">{user.name}</p>
              </div>
              <div className="bg-[#111827] p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-sm">Email</p>
                <p className="text-white font-semibold">{user.email}</p>
              </div>
              <div className="bg-[#111827] p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-sm">Department</p>
                <p className="text-white font-semibold">{user.department}</p>
              </div>
              <div className="bg-[#111827] p-4 rounded-lg border border-[#374151]">
                <p className="text-[#9CA3AF] text-sm">Staff Number</p>
                <p className="text-white font-semibold">{user.staffNumber}</p>
              </div>
              {user.phone && (
                <div className="bg-[#111827] p-4 rounded-lg border border-[#374151]">
                  <p className="text-[#9CA3AF] text-sm">Phone</p>
                  <p className="text-white font-semibold">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking History Modal */}
      {showBookingHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-[#1F2937] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#374151]">
            <div className="flex justify-between items-center p-6 border-b border-[#374151]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaHistory className="text-[#3B82F6]" />
                My Booking History
              </h2>
              <button
                onClick={() => setShowBookingHistory(false)}
                className="text-[#9CA3AF] hover:text-white text-2xl transition"
              >
                ✖
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {getUserBookings().length === 0 ? (
                <div className="text-center py-12">
                  <FaHistory className="text-6xl text-[#374151] mx-auto mb-4" />
                  <p className="text-[#9CA3AF] text-lg">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUserBookings().map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-[#111827] p-5 rounded-lg border border-[#374151] hover:border-[#3B82F6] transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">{booking.room}</h3>
                          <p className="text-[#9CA3AF] text-sm">
                            {new Date(booking.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'Approved' 
                            ? 'bg-green-600 text-white' 
                            : booking.status === 'Rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-500 text-yellow-900'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-[#1F2937] p-3 rounded border border-[#374151]">
                          <p className="text-[#9CA3AF] text-xs mb-1">Time Slot(s)</p>
                          <p className="text-white font-semibold text-sm">
                            {formatSlotsDisplay(booking.slots || [booking.slot])}
                          </p>
                        </div>
                        <div className="bg-[#1F2937] p-3 rounded border border-[#374151]">
                          <p className="text-[#9CA3AF] text-xs mb-1">Booked On</p>
                          <p className="text-white font-semibold text-sm">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#1F2937] p-3 rounded border border-[#374151]">
                        <p className="text-[#9CA3AF] text-xs mb-1">Reason</p>
                        <p className="text-white text-sm">{booking.reason}</p>
                      </div>
                      {booking.status === 'Rejected' && booking.rejectionReason && (
                        <div className="mt-3 bg-red-900/20 border border-red-900/50 p-3 rounded">
                          <p className="text-red-400 text-xs mb-1">Rejection Reason</p>
                          <p className="text-red-300 text-sm">{booking.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
