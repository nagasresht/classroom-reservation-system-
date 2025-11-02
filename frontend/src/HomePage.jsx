import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaDoorOpen, FaFlask } from 'react-icons/fa';

const allRooms = [
  { id: 1, name: "Peb 10", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 2, name: "Peb 11", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 3, name: "Peb 12", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 4, name: "Peb 13", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 5, name: "Peb 14", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 6, name: "Peb 15", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 7, name: "B 407", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 8, name: "B 408", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 9, name: "A 103", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 10, name: "B 312", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 11, name: "B 313", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 12, name: "NB 201", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 13, name: "NB 202", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 14, name: "NB 203", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 15, name: "NB 204", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 16, name: "NB 205", type: "Theory", color: "bg-[#3B82F6]/20" },
  { id: 17, name: "A 117", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 18, name: "A 118", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 19, name: "A 108", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 20, name: "P 403", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 21, name: "A007", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 22, name: "B 314", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 23, name: "B 315", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 24, name: "B 316", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 25, name: "B 317", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 26, name: "P 410", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 27, name: "P403", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 28, name: "A109", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 29, name: "A 111", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 30, name: "A 113", type: "Lab", color: "bg-[#60A5FA]/20" },
  { id: 31, name: "D 518", type: "Lab", color: "bg-[#60A5FA]/20" }
];

const timeSlots = [
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 1:40",
  "1:40 - 2:40",
  "2:40 - 3:40",
  "3:40 - 4:40"
];

const facultyList = Array.from({ length: 15 }, (_, i) => `Faculty ${i + 1}`);

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("Rooms");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(facultyList[0]);

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

  const getSlotStatus = (slot) => {
    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const academicBlocked = academicSlots.some(entry =>
      entry.day === dayOfWeek &&
      entry.slot === slot &&
      entry.room === selectedRoom?.name
    );
    if (academicBlocked) return "Blocked (Academic)";

    const slotBookings = bookings.filter(
      (b) => b.slot === slot && b.room === selectedRoom?.name && b.date === selectedDate
    );
    const approved = slotBookings.find(b => b.status === "Approved");

    if (!slotBookings.length) return "Free";
    if (approved) return approved.email === user.email ? "Approved" : `Booked by ${approved.facultyName}`;
    return "Pending";
  };

  const handleBookSlot = async (slot) => {
    const reason = prompt("Enter the purpose of booking this room:");
    if (!reason) return;

    const booking = {
      date: selectedDate,
      room: selectedRoom.name,
      slot,
      reason,
      status: "Pending",
      facultyName: user.name,
      email: user.email,
      department: user.department,
      staffNumber: user.staffNumber
    };

    const res = await fetch("http://localhost:5000/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });

    if (res.ok) {
      alert("Booking request sent!");
      fetchBookings();
    } else {
      alert("Booking failed");
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
            ? `${found.type === 'Lab' ? 'Teaching Lab' : 'Teaching Class'} (${found.subject})`
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

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      value: date.toISOString().split('T')[0]
    };
  });

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
          <span className="text-sm flex items-center gap-2 bg-[#1F2937] px-4 py-2 rounded-lg border border-[#374151] text-white font-medium">
            <FaUser className="text-[#3B82F6]" /> {user.name}
          </span>
          <button 
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }} 
            className="text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 font-medium shadow-lg shadow-red-600/30"
          >
            <FaSignOutAlt /> Logout
          </button>
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
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="mb-6 w-full bg-[#1F2937] border border-[#374151] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition"
          >
            {facultyList.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
          {renderFacultyView()}
        </div>
      ) : (
        <>
          {/* Room/Lab Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mb-10">
            {filteredRooms.map((room) => (
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
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {selectedRoom && (
            <div className="bg-[#1F2937] border border-[#374151] shadow-2xl p-8 rounded-2xl max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] rounded-full"></span>
                Slots for {selectedRoom.name} on {selectedDate}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {timeSlots.map(slot => {
                  const status = getSlotStatus(slot);
                  const bgClass =
                    status === "Free" ? "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[#3B82F6]/50" :
                    status === "Pending" ? "bg-yellow-500 text-yellow-900 border-yellow-600" :
                    status.startsWith("Approved") || status === "Approved" ? "bg-green-600 text-white shadow-green-600/50" :
                    status.startsWith("Blocked") ? "bg-[#374151] text-[#9CA3AF] cursor-not-allowed" :
                    "bg-red-600 text-white shadow-red-600/50";

                  return (
                    <div
                      key={slot}
                      className={`p-5 rounded-lg border border-[#374151] text-center transition-all cursor-pointer font-semibold shadow-lg transform hover:scale-105 ${bgClass} ${status === "Free" ? "" : "cursor-default"}`}
                      onClick={() => status === "Free" && handleBookSlot(slot)}
                    >
                      <div className="text-sm">{slot}</div>
                      <div className="text-xs mt-2 font-normal">{status}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
