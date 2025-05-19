import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

export default function AdminTimetableView() {
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const timeSlots = [
    "9:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 1:40",
    "1:40 - 2:40",
    "2:40 - 3:40",
    "3:40 - 4:40"
  ];

  const fetchTimetable = async () => {
    if (!year || !section) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/calendar/view?year=${year}&section=${section}`);
      const data = await res.json();
      setTimetable(data);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimetable();
  }, [year, section]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">📘 Academic Timetable View</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select value={year} onChange={(e) => setYear(e.target.value)} className="border px-4 py-2 rounded shadow">
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="border px-4 py-2 rounded shadow">
            <option value="">Select Section</option>
            <option value="CSE-1">CSE-1</option>
            <option value="CSE-2">CSE-2</option>
            <option value="CSE-3">CSE-3</option>
            <option value="CSE-4">CSE-4</option>
            <option value="CSBS">CSBS</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading timetable...</p>
        ) : year && section ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg text-sm">
              <thead>
                <tr className="bg-purple-100 text-purple-800 text-center">
                  <th className="border px-4 py-2">Day / Slot</th>
                  {timeSlots.map(slot => (
                    <th key={slot} className="border px-4 py-2">{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day} className="hover:bg-gray-50 text-center">
                    <td className="border font-medium bg-gray-100">{day}</td>
                    {timeSlots.map(slot => (
                      <td key={slot} className="border px-2 py-1 text-xs whitespace-pre-line">
                        {timetable?.[day]?.[slot] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-4">Please select both year and section.</p>
        )}
      </div>
    </div>
  );
}
