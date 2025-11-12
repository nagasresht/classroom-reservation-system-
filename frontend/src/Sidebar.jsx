import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaCalendarAlt, FaClipboardList, FaBook, FaHistory, FaHome, FaTimes } from 'react-icons/fa';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Dashboard', icon: <FaHome />, path: '/admin-dashboard' },
    { label: 'Booking Requests', icon: <FaClipboardList />, path: '/admin' },
    { label: 'Add Timetable', icon: <FaCalendarAlt />, path: '/admin-add-timetable' },
    { label: 'View Timetable', icon: <FaBook />, path: '/admin-timetable' },
    { label: 'Booking History', icon: <FaHistory />, path: '/admin-history' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose(); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-50 
        w-64 h-screen bg-white border-r flex flex-col justify-between shadow 
        overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between p-6 lg:block">
            <h2 className="text-xl font-bold text-purple-700">Admin Menu</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-600 hover:text-gray-800"
              aria-label="Close menu"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <ul className="space-y-2 px-4">
            {links.map(({ label, icon, path }) => (
              <li
                key={label}
                onClick={() => handleNavigation(path)}
                className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer transition-colors ${
                  location.pathname === path 
                    ? 'bg-gray-200 text-purple-800 font-semibold' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {icon}
                <span className="whitespace-nowrap">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </>
  );
}
