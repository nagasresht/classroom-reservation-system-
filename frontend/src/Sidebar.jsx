import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaCalendarAlt, FaClipboardList, FaBook, FaHistory, FaHome } from 'react-icons/fa';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Dashboard', icon: <FaHome />, path: '/admin-dashboard' },
    { label: 'Booking Requests', icon: <FaClipboardList />, path: '/admin' },
    { label: 'Add Timetable', icon: <FaCalendarAlt />, path: '/admin-calendar' },
    { label: 'View Timetable', icon: <FaBook />, path: '/admin-timetable' },
    { label: 'Booking History', icon: <FaHistory />, path: '/admin-history' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between shadow">
      <div>
        <h2 className="text-xl font-bold text-purple-700 p-6">Admin Menu</h2>
        <ul className="space-y-2 px-4">
          {links.map(({ label, icon, path }) => (
            <li
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer ${
                location.pathname === path ? 'bg-gray-200 text-purple-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {icon}
              {label}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}
