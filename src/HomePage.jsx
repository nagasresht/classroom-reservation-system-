import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';

const allRooms = [
  { id: 1, name: "Peb 10", type: "Theory", color: "bg-blue-100" },
  { id: 2, name: "Peb 11", type: "Theory", color: "bg-blue-100" },
  { id: 3, name: "Peb 12", type: "Theory", color: "bg-blue-100" },
  { id: 4, name: "Peb 13", type: "Theory", color: "bg-blue-100" },
  { id: 5, name: "Peb 14", type: "Theory", color: "bg-blue-100" },
  { id: 6, name: "Peb 15", type: "Theory", color: "bg-blue-100" },
  { id: 7, name: "B 407", type: "Theory", color: "bg-blue-100" },
  { id: 8, name: "B 408", type: "Theory", color: "bg-blue-100" },
  { id: 9, name: "A 103", type: "Theory", color: "bg-blue-100" },
  { id: 10, name: "B 312", type: "Theory", color: "bg-blue-100" },
  { id: 11, name: "B 313", type: "Theory", color: "bg-blue-100" },
  { id: 12, name: "NB 201", type: "Theory", color: "bg-blue-100" },
  { id: 13, name: "NB 202", type: "Theory", color: "bg-blue-100" },
  { id: 14, name: "NB 203", type: "Theory", color: "bg-blue-100" },
  { id: 15, name: "NB 204", type: "Theory", color: "bg-blue-100" },
  { id: 16, name: "NB 205", type: "Theory", color: "bg-blue-100" },
  { id: 17, name: "A 117", type: "Lab", color: "bg-purple-100" },
  { id: 18, name: "A 118", type: "Lab", color: "bg-purple-100" },
  { id: 19, name: "A 108", type: "Lab", color: "bg-purple-100" },
  { id: 20, name: "P 403", type: "Lab", color: "bg-purple-100" },
  { id: 21, name: "A007", type: "Lab", color: "bg-purple-100" },
  { id: 22, name: "B 314", type: "Lab", color: "bg-purple-100" },
  { id: 23, name: "B 315", type: "Lab", color: "bg-purple-100" },
  { id: 24, name: "B 316", type: "Lab", color: "bg-purple-100" },
  { id: 25, name: "B 317", type: "Lab", color: "bg-purple-100" },
  { id: 26, name: "P 410", type: "Lab", color: "bg-purple-100" },
  { id: 27, name: "P403", type: "Lab", color: "bg-purple-100" },
  { id: 28, name: "A109", type: "Lab", color: "bg-purple-100" },
  { id: 29, name: "A 111", type: "Lab", color: "bg-purple-100" },
  { id: 30, name: "A 113", type: "Lab", color: "bg-purple-100" },
  { id: 31, name: "D 518", type: "Lab", color: "bg-purple-100" }
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
      <div className="mt-6 space-y-4">
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
            <div key={slot} className={`p-4 rounded shadow flex justify-between items-center
              ${label === "Free" ? 'bg-blue-100 text-blue-800' : 'bg-green-600 text-white'}`}>
              <span className="font-medium">{slot}</span>
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
    <div className="min-h-screen px-6 py-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold text-purple-700">Room Maestro</div>
        <div className="flex items-center gap-4">
          <span className="text-sm flex items-center gap-2 text-gray-600">
            <FaCalendarAlt /> {new Date().toLocaleDateString()}
          </span>
          <span className="text-sm flex items-center gap-2 bg-white px-3 py-1 rounded-full text-purple-700 font-medium shadow">
            <FaUser /> {user.name}
          </span>
          <button onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }} className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3 mb-4">
        {days.map((day) => (
          <button
            key={day.value}
            onClick={() => {
              setSelectedDate(day.value);
              setSelectedRoom(null);
            }}
            className={`px-4 py-2 rounded-xl text-sm shadow-sm transition ${
              selectedDate === day.value
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-white border rounded-full shadow-inner">
          {["Rooms", "Labs", "Faculty"].map(tab => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full ${
                activeTab === tab ? "bg-purple-600 text-white" : "text-gray-700"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setSelectedRoom(null);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Faculty" ? (
        <div className="max-w-md mx-auto">
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="mb-6 w-full border px-4 py-2 rounded shadow"
          >
            {facultyList.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
          {renderFacultyView()}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mb-10">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`cursor-pointer px-2 py-3 rounded-lg shadow-sm text-center transition ${room.color} ${
                  selectedRoom?.id === room.id ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <div className="text-sm font-bold text-gray-700 truncate">{room.name}</div>
                <div className="text-xs text-gray-500">{room.type}</div>
              </div>
            ))}
          </div>

          {selectedRoom && (
            <div className="bg-white shadow-md p-6 rounded-xl max-w-3xl mx-auto">
              <h2 className="text-lg font-bold mb-4 text-purple-700">
                Slots for {selectedRoom.name} on {selectedDate}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {timeSlots.map(slot => {
                  const status = getSlotStatus(slot);
                  const bgClass =
                    status === "Free" ? "bg-blue-100 hover:bg-blue-200" :
                    status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    status.startsWith("Approved") || status === "Approved" ? "bg-green-600 text-white" :
                    status.startsWith("Blocked") ? "bg-gray-300 text-gray-600" :
                    "bg-red-200 text-red-800";

                  return (
                    <div
                      key={slot}
                      className={`p-4 rounded shadow text-center transition-all cursor-pointer font-medium ${bgClass}`}
                      onClick={() => status === "Free" && handleBookSlot(slot)}
                    >
                      <div>{slot}</div>
                      <div className="text-sm mt-1">{status}</div>
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
