import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';

export default function AdminCalendarPanel() {
  const [form, setForm] = useState({
    year: '',
    section: '',
    day: '',
    slot: '',
    type: '',
    subject: '',
    room: '',
    faculty: '',
    batch1: { name: '', room: '' },
    batch2: { name: '', room: '' }
  });

  const [message, setMessage] = useState('');
  const [autoRoom, setAutoRoom] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fullSlots = [
    "9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 1:40", "1:40 - 2:40", "2:40 - 3:40", "3:40 - 4:40"
  ];

  const getAvailableSlots = () => {
    const year = form.year;
    if (year === "1st Year") {
      return fullSlots.filter(slot => slot !== "3:40 - 4:40");
    } else if (["2nd Year", "3rd Year", "4th Year"].includes(year)) {
      return fullSlots.filter(slot => slot !== "9:00 - 10:00");
    }
    return [];
  };

  const nextTwoSlots = (startIndex, slotList) => {
    const block = [];
    for (let i = 0; i < 3 && startIndex + i < slotList.length; i++) {
      block.push(slotList[startIndex + i]);
    }
    return block;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name.startsWith('batch1.') || name.startsWith('batch2.')) {
      const [batch, field] = name.split('.');
      setForm(prev => ({
        ...prev,
        [batch]: { ...prev[batch], [field]: value }
      }));
    } else {
      const updatedForm = { ...form, [name]: value };
      setForm(updatedForm);

      if (
        (name === 'year' || name === 'section' || name === 'type') &&
        updatedForm.year && updatedForm.section && updatedForm.type === 'Class'
      ) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/classroom/get-room?year=${updatedForm.year}&section=${updatedForm.section}`
          );
          const data = await res.json();
          if (res.ok) {
            setAutoRoom(data.room);
          } else {
            setAutoRoom('');
            alert(data.message || 'No room mapping found');
          }
        } catch (err) {
          console.error('Room fetch error:', err);
          setAutoRoom('');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const slots = getAvailableSlots();
    const slotIndex = slots.indexOf(form.slot);
    if (slotIndex === -1) return setMessage('❌ Invalid slot selected');

    let payloads = [];

    if (form.type === "Class") {
      payloads.push({
        year: form.year,
        section: form.section,
        day: form.day,
        slot: form.slot,
        type: "Class",
        subject: form.subject,
        room: autoRoom,
        faculty: form.faculty // ✅ New
      });
    } else if (form.type === "Lab") {
      const labSlots = nextTwoSlots(slotIndex, slots);
      payloads = labSlots.flatMap((slot) => [
        {
          year: form.year,
          section: form.section,
          day: form.day,
          slot,
          type: "Lab",
          subject: form.batch1.name,
          room: form.batch1.room,
          faculty: form.faculty // ✅ Add faculty to lab slots too
        },
        {
          year: form.year,
          section: form.section,
          day: form.day,
          slot,
          type: "Lab",
          subject: form.batch2.name,
          room: form.batch2.room,
          faculty: form.faculty
        }
      ]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/calendar/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: payloads })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Timetable updated successfully!');
        setForm({
          year: '', section: '', day: '', slot: '', type: '',
          subject: '', room: '', faculty: '', batch1: { name: '', room: '' }, batch2: { name: '', room: '' }
        });
        setAutoRoom('');
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Try again.');
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
          <h2 className="text-lg font-bold text-purple-700">Academic Entry</h2>
          <div className="w-6"></div>
        </div>

        <div className="px-4 sm:px-6 py-6 sm:py-10">
          <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-purple-700 text-center">🗓️ Admin Academic Entry</h2>
            {message && <p className="mb-4 text-center font-semibold text-sm sm:text-base">{message}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="year" value={form.year} onChange={handleChange} required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base">
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <select name="section" value={form.section} onChange={handleChange} required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base">
              <option value="">Select Section</option>
              <option value="CSE-1">CSE-1</option>
              <option value="CSE-2">CSE-2</option>
              <option value="CSE-3">CSE-3</option>
              <option value="CSE-4">CSE-4</option>
              <option value="CSBS">CSBS</option>
            </select>
            <select name="day" value={form.day} onChange={handleChange} required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base">
              <option value="">Select Day</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select name="slot" value={form.slot} onChange={handleChange} required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base">
              <option value="">Select Slot</option>
              {getAvailableSlots().map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
            <select name="type" value={form.type} onChange={handleChange} required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base">
              <option value="">Select Type</option>
              <option value="Class">Class</option>
              <option value="Lab">Lab</option>
            </select>

            {/* Faculty Dropdown */}
            <select name="faculty" value={form.faculty} onChange={handleChange} required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base">
              <option value="">Select Faculty</option>
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i} value={`Faculty ${i + 1}`}>Faculty {i + 1}</option>
              ))}
            </select>

            {/* Class inputs */}
            {form.type === "Class" && (
              <>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject Name" required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base" />
                <input value={autoRoom} readOnly placeholder="Auto-fetched Room" className="border px-3 sm:px-4 py-2 rounded shadow bg-gray-100 text-gray-600 text-sm sm:text-base" />
              </>
            )}

            {/* Lab inputs */}
            {form.type === "Lab" && (
              <>
                <input name="batch1.name" value={form.batch1.name} onChange={handleChange} placeholder="Batch 1 Lab Name" required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base" />
                <input name="batch1.room" value={form.batch1.room} onChange={handleChange} placeholder="Batch 1 Room" required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base" />
                <input name="batch2.name" value={form.batch2.name} onChange={handleChange} placeholder="Batch 2 Lab Name" required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base" />
                <input name="batch2.room" value={form.batch2.room} onChange={handleChange} placeholder="Batch 2 Room" required className="border px-3 sm:px-4 py-2 rounded shadow text-sm sm:text-base" />
              </>
            )}

            <div className="md:col-span-2 flex justify-center mt-4">
              <button type="submit" className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-purple-700 shadow text-sm sm:text-base transition-colors w-full sm:w-auto">
                Save Entry
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
