import React, { useState } from 'react';
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
        // Single class entry
        entries = [{
          year: formData.year,
          section: formData.section,
          day: formData.day,
          slot: formData.classSlot,
          type: 'Class',
          subject: formData.subject,
          room: formData.room,
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
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
            >
              ← Back
            </button>
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

                  <div>
                    <label className="block text-sm font-semibold mb-2">Room Number</label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => handleChange('room', e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:outline-none"
                      placeholder="e.g., A 117"
                    />
                  </div>

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
                    disabled={!formData.subject || !formData.room || 
                      (formData.type === 'Lab' ? !formData.labSlot : !formData.classSlot)}
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
                <h2 className="text-xl font-bold mb-4 text-gray-800">Step 6: Enter Faculty Name</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Faculty Name</label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => handleChange('faculty', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-600 focus:outline-none"
                    placeholder="e.g., Dr. John Smith"
                  />
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
