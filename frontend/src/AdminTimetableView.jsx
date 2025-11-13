import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import API_BASE_URL from './config/api';

export default function AdminTimetableView() {
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const branches = ["CSE", "CSBS"];
  const cseSections = ["A", "B", "C", "D"];
  const csbsSections = ["A"];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get sections based on branch
  const getSections = () => {
    return branch === "CSBS" ? csbsSections : cseSections;
  };

  // Time slots based on year selection
  const getTimeSlots = () => {
    if (year === "1st Year") {
      return [
        "9:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "12:00-12:40",
        "12:00-1:00",
        "12:40-1:40",
        "1:40-2:40",
        "2:40-3:40",
      ];
    } else {
      return [
        "10:00-11:00",
        "11:00-12:00",
        "12:00-12:40",
        "12:00-1:00",
        "12:40-1:40",
        "1:40-2:40",
        "2:40-3:40",
        "3:40-4:40",
      ];
    }
  };

  const timeSlots = getTimeSlots();

  const fetchTimetable = async () => {
    if (!year || !section) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/calendar/view?year=${year}&section=${section}`
      );
      const data = await res.json();
      console.log("Fetched timetable data:", data);
      setTimetable(data);
    } catch (err) {
      console.error("Error fetching timetable:", err);
      alert("Failed to fetch timetable. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (year && section) {
      fetchTimetable();
    }
  }, [year, section]);

  // Reset section when branch changes
  useEffect(() => {
    setSection("");
  }, [branch]);

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
          <h2 className="text-lg font-bold text-purple-700">Timetable View</h2>
          <div className="w-6"></div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-700">
            📘 Academic Timetable View
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="border border-gray-300 px-3 sm:px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-gray-300 px-3 sm:px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="border border-gray-300 px-3 sm:px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              disabled={!branch}
            >
              <option value="">Select Section</option>
              {branch &&
                getSections().map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 text-sm sm:text-base">
              Loading timetable...
            </p>
          ) : year && section ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0 bg-white rounded-lg shadow">
              <table className="w-full border-collapse text-xs sm:text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-purple-600 text-white text-center">
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold">
                      Day / Time
                    </th>
                    {timeSlots.map((slot) => (
                      <th
                        key={slot}
                        className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap"
                      >
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day} className="hover:bg-purple-50 text-center">
                      <td className="border border-gray-300 font-semibold bg-purple-100 text-purple-800 px-2 sm:px-4 py-2 sm:py-3">
                        {day}
                      </td>
                      {timeSlots.map((slot) => {
                        const cellContent = timetable?.[day]?.[slot];
                        const isBreak = slot.includes("Break");

                        return (
                          <td
                            key={slot}
                            className={`border border-gray-300 px-2 sm:px-3 py-2 sm:py-3 ${
                              isBreak
                                ? "bg-gray-200 text-gray-500 italic"
                                : cellContent
                                ? "bg-blue-50 text-blue-900 font-medium"
                                : "bg-white text-gray-400"
                            }`}
                          >
                            {isBreak ? "BREAK" : cellContent || "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                📅 Please select <strong>Branch</strong>, <strong>Year</strong>,
                and <strong>Section</strong> to view the timetable.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
