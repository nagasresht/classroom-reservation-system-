import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function AdminTimetable() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    year: '',
    section: '',
    day: '',
    type: '', // 'Class' or 'Lab'
    subject: '',
    room: '',
    faculty: '',
    labSlot: '', // For lab: 'morning' or 'afternoon'
    classSlot: '' // For class: single hour slot
  });
  const [message, setMessage] = useState('');
  const [facultySearch, setFacultySearch] = useState('');
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [savedSectionRoom, setSavedSectionRoom] = useState(null);
  const [allowRoomChange, setAllowRoomChange] = useState(false);


  // Faculty list
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

  // Time slots for different years
  const firstYearSlots = [
    "9:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-12:40", // Break
    "12:40-1:40", "1:40-2:40", "2:40-3:40"
  ];

  const seniorYearSlots = [
    "10:00-11:00", "11:00-12:00", "12:00-1:00",
    "1:00-1:40", // Break
    "1:40-2:40", "2:40-3:40", "3:40-4:40"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const sections = ["A", "B", "C", "D"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const types = ["Class", "Lab"];

  // Theory/Class rooms (for first-time selection)
  const theoryRooms = [
    "E003", "E004", "E005", "E006", "E012 & E013", 
    "E032", "E033", "E034 (Audi)", "E035", "E036", "E037", "E038"
  ];

  // Lab rooms (for lab selection)
  const labRooms = [
    "E001", "E002", "E014 & E015", "E028", "E029", "E030 & E031"
  ];

  // Fetch saved section room when year and section are selected
  useEffect(() => {
    const fetchSectionRoom = async () => {
      if (formData.year && formData.section) {
        try {
          const res = await fetch(`http://localhost:5000/api/calendar/section-room/${formData.year}/${formData.section}`);
          const data = await res.json();
          setSavedSectionRoom(data.room);
          if (data.room && formData.type === 'Class') {
            handleChange('room', data.room);
          }
        } catch (error) {
          console.error('Error fetching section room:', error);
          setSavedSectionRoom(null);
        }
      }
    };
    fetchSectionRoom();
  }, [formData.year, formData.section, formData.type]);

  // Get available slots based on year
  const getAvailableSlots = () => {
    if (formData.year === "1st Year") {
      return firstYearSlots.filter(slot => slot !== "12:00-12:40");
    } else {
      return seniorYearSlots.filter(slot => slot !== "1:00-1:40");
    }
  };

  // Get lab time blocks based on year
  const getLabSlots = () => {
    if (formData.year === "1st Year") {
      return [
        { label: "Morning Lab (9:00 - 12:00)", value: "morning", slots: ["9:00-10:00", "10:00-11:00", "11:00-12:00"] },
        { label: "Afternoon Lab (1:40 - 3:40)", value: "afternoon", slots: ["12:40-1:40", "1:40-2:40", "2:40-3:40"] }
      ];
    } else {
      return [
        { label: "Morning Lab (10:00 - 1:00)", value: "morning", slots: ["10:00-11:00", "11:00-12:00", "12:00-1:00"] },
        { label: "Afternoon Lab (1:40 - 4:40)", value: "afternoon", slots: ["1:40-2:40", "2:40-3:40", "3:40-4:40"] }
      ];
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      let entries = [];

      if (formData.type === 'Lab') {
        // Get the lab slot details
        const labSlotInfo = getLabSlots().find(ls => ls.value === formData.labSlot);
        
        if (!labSlotInfo) {
          alert('Please select a lab slot');
          return;
        }

        // Create entry for each time slot in the lab block
        entries = labSlotInfo.slots.map(slot => ({
          year: formData.year,
          section: formData.section,
          day: formData.day,
          slot: slot,
          type: 'Lab',
          subject: formData.subject,
          room: formData.room,
          faculty: formData.faculty
        }));
      } else {
        // Single class entry - use the saved or newly selected room
        const classRoom = formData.room;
        
        // If this is the first time (no saved room) OR room is being changed, save/update the room mapping
        if ((!savedSectionRoom || allowRoomChange) && classRoom) {
          await fetch('http://localhost:5000/api/calendar/section-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              year: formData.year,
              section: formData.section,
              room: classRoom
            })
          });
        }

        entries = [{
          year: formData.year,
          section: formData.section,
          day: formData.day,
          slot: formData.classSlot,
          type: 'Class',
          subject: formData.subject,
          room: classRoom || savedSectionRoom,
          faculty: formData.faculty
        }];
      }

      console.log('Submitting entries:', entries);

      const res = await fetch('http://localhost:5000/api/calendar/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Timetable entry added successfully!');
        setTimeout(() => {
          setFormData({
            year: '',
            section: '',
            day: '',
            type: '',
            subject: '',
            room: '',
            faculty: '',
            labSlot: '',
            classSlot: ''
          });
          setStep(1);
          setMessage('');
          setAllowRoomChange(false);
          setSavedSectionRoom(null);
        }, 2000);
      } else {
        setMessage('❌ ' + (data.message || 'Failed to add timetable entry'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage('❌ Network error');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-700">Add Timetable Entry</h1>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (window.confirm('⚠️ WARNING: This will delete ALL timetable entries and section room mappings!\n\nThis action cannot be undone. Are you sure?')) {
                    try {
                      // Delete all academic calendar entries
                      const res1 = await fetch('http://localhost:5000/api/calendar/delete-all', {
                        method: 'DELETE'
                      });
                      const data1 = await res1.json();
                      
                      // Delete all section room mappings
                      const res2 = await fetch('http://localhost:5000/api/calendar/delete-all-rooms', {
                        method: 'DELETE'
                      });
                      const data2 = await res2.json();
                      
                      if (res1.ok && res2.ok) {
                        alert(`✅ Successfully deleted:\n- ${data1.deletedCount} timetable entries\n- ${data2.deletedCount} section room mappings`);
                        window.location.reload();
                      } else {
                        alert('❌ Failed to delete some data');
                      }
                    } catch (error) {
                      console.error(error);
                      alert('❌ Error deleting data');
                    }
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
              >
                🗑️ Delete All Data
              </button>
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  {s < 6 && <div className={`flex-1 h-1 ${step > s ? 'bg-purple-600' : 'bg-gray-300'}`} />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Year</span>
              <span>Section</span>
              <span>Day</span>
              <span>Type</span>
              <span>Details</span>
              <span>Faculty</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Step 1: Select Year */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Step 1: Select Year</h2>
                <div className="grid grid-cols-2 gap-4">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => {
                        handleChange('year', year);
                        handleNext();
                      }}
                      className={`p-6 rounded-lg border-2 font-semibold text-lg transition-all ${
                        formData.year === year
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Section */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Step 2: Select Section</h2>
                <div className="grid grid-cols-4 gap-4">
                  {sections.map(section => (
                    <button
                      key={section}
                      onClick={() => {
                        handleChange('section', section);
                        handleNext();
                      }}
                      className={`p-6 rounded-lg border-2 font-semibold text-lg transition-all ${
                        formData.section === section
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      Section {section}
                    </button>
                  ))}
                </div>
                <button onClick={handleBack} className="mt-4 text-purple-600 hover:text-purple-800">
                  ← Back
                </button>
              </div>
            )}

            {/* Step 3: Select Day */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Step 3: Select Day</h2>
                <div className="grid grid-cols-2 gap-4">
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => {
                        handleChange('day', day);
                        handleNext();
                      }}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        formData.day === day
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <button onClick={handleBack} className="mt-4 text-purple-600 hover:text-purple-800">
                  ← Back
                </button>
              </div>
            )}

            {/* Step 4: Select Type (Class or Lab) */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Step 4: Select Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  {types.map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        handleChange('type', type);
                        handleNext();
                      }}
                      className={`p-8 rounded-lg border-2 font-semibold text-xl transition-all ${
                        formData.type === type
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {type === 'Class' ? '📚 Class' : '🔬 Lab'}
                      <div className="text-sm text-gray-600 mt-2">
                        {type === 'Class' ? '1 hour slot' : '3 hour block'}
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={handleBack} className="mt-4 text-purple-600 hover:text-purple-800">
                  ← Back
                </button>
              </div>
            )}

            {/* Step 5: Enter Details (Subject, Room, Slot) */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Step 5: Enter Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Subject Name</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:outline-none"
                      placeholder="e.g., Data Structures"
                    />
                  </div>

                  {formData.type === 'Lab' ? (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Lab Room</label>
                      <select
                        value={formData.room}
                        onChange={(e) => handleChange('room', e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:outline-none"
                      >
                        <option value="">Select Lab Room</option>
                        {labRooms.map(room => (
                          <option key={room} value={room}>{room}</option>
                        ))}
                      </select>
                    </div>
                  ) : savedSectionRoom && !allowRoomChange ? (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Classroom (Saved)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={savedSectionRoom}
                          disabled
                          className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAllowRoomChange(true);
                            handleChange('room', '');
                          }}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition whitespace-nowrap"
                        >
                          Change Room
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Using saved classroom for {formData.year} Section {formData.section}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        {savedSectionRoom ? 'Update Classroom' : 'Select Classroom (First Time)'}
                      </label>
                      <select
                        value={formData.room}
                        onChange={(e) => handleChange('room', e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:outline-none"
                      >
                        <option value="">Select Theory Room</option>
                        {theoryRooms.map(room => (
                          <option key={room} value={room}>{room}</option>
                        ))}
                      </select>
                      <p className="text-xs text-blue-600 mt-1">
                        {savedSectionRoom 
                          ? `Changing classroom for ${formData.year} Section ${formData.section}. This will update all future entries.`
                          : `This room will be saved for all future classes of ${formData.year} Section ${formData.section}`
                        }
                      </p>
                      {savedSectionRoom && (
                        <button
                          type="button"
                          onClick={() => {
                            setAllowRoomChange(false);
                            handleChange('room', savedSectionRoom);
                          }}
                          className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                        >
                          ← Cancel, keep {savedSectionRoom}
                        </button>
                      )}
                    </div>
                  )}

                  {formData.type === 'Lab' ? (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Lab Slot (3 hours)</label>
                      <select
                        value={formData.labSlot}
                        onChange={(e) => handleChange('labSlot', e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:outline-none"
                      >
                        <option value="">Select Lab Slot</option>
                        {getLabSlots().map(slot => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        This will occupy 3 consecutive hours
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Time Slot (1 hour)</label>
                      <select
                        value={formData.classSlot}
                        onChange={(e) => handleChange('classSlot', e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:outline-none"
                      >
                        <option value="">Select Time Slot</option>
                        {getAvailableSlots().map(slot => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-4">
                  <button onClick={handleBack} className="text-purple-600 hover:text-purple-800">
                    ← Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!formData.subject || 
                      (formData.type === 'Lab' ? (!formData.room || !formData.labSlot) : 
                        (!formData.classSlot || (!savedSectionRoom && !formData.room)))}
                    className="flex-1 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Select Faculty */}
            {step === 6 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Step 6: Select Faculty</h2>
                
                <div className="mb-6 relative">
                  <label className="block text-sm font-semibold mb-2">Faculty Name</label>
                  <input
                    type="text"
                    value={formData.faculty || facultySearch}
                    onChange={(e) => {
                      setFacultySearch(e.target.value);
                      handleChange('faculty', ''); // Clear selection when typing
                      setShowFacultyDropdown(true);
                    }}
                    onFocus={() => setShowFacultyDropdown(true)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:outline-none"
                    placeholder="Type to search faculty..."
                  />
                  
                  {/* Dropdown list */}
                  {showFacultyDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {facultyList
                        .filter(faculty => 
                          faculty.toLowerCase().includes((formData.faculty || facultySearch).toLowerCase())
                        )
                        .map((faculty, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              handleChange('faculty', faculty);
                              setFacultySearch('');
                              setShowFacultyDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                          >
                            {faculty}
                          </div>
                        ))}
                      {facultyList.filter(faculty => 
                        faculty.toLowerCase().includes((formData.faculty || facultySearch).toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-2 text-gray-500 text-center">
                          No faculty found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4 text-purple-800">📋 Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Year:</span> {formData.year}
                    </div>
                    <div>
                      <span className="font-semibold">Section:</span> {formData.section}
                    </div>
                    <div>
                      <span className="font-semibold">Day:</span> {formData.day}
                    </div>
                    <div>
                      <span className="font-semibold">Type:</span> {formData.type}
                    </div>
                    <div>
                      <span className="font-semibold">Subject:</span> {formData.subject}
                    </div>
                    <div>
                      <span className="font-semibold">Room:</span> {formData.room}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">Time:</span>{' '}
                      {formData.type === 'Lab' 
                        ? getLabSlots().find(ls => ls.value === formData.labSlot)?.label 
                        : formData.classSlot}
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">Faculty:</span> {formData.faculty || 'Not specified'}
                    </div>
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={handleBack} className="text-purple-600 hover:text-purple-800">
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.faculty}
                    className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
                  >
                    ✅ Submit Timetable Entry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
