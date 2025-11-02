import React from 'react';

export default function RoomSlotModal({ room, date, slots, onClose, onBook }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-700">
            Slots for {room?.name} on {new Date(date).toLocaleDateString()}
          </h2>
          <button
            onClick={onClose}
            className="text-red-600 font-bold text-lg hover:text-red-800"
          >
            ✖
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {slots.map(({ label, status }) => (
            <div
              key={label}
              className={`p-4 rounded shadow text-center cursor-pointer transition-all border-2 ${
                status === 'Free' ? 'bg-blue-100 border-blue-400 hover:bg-blue-200' :
                status.startsWith('Blocked') ? 'bg-red-100 border-red-400 cursor-not-allowed' :
                status.startsWith('Approved') ? 'bg-green-600 text-white border-green-700 cursor-not-allowed' :
                'bg-yellow-100 border-yellow-400'
              }`}
              onClick={() => status === 'Free' && onBook(label)}
            >
              <div className="font-semibold">{label}</div>
              <div className="text-xs mt-1">{status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
