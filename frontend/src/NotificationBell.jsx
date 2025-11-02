import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaTimes, FaCheckDouble, FaTrash } from 'react-icons/fa';

export default function NotificationBell({ userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${encodeURIComponent(userEmail)}/read-all`, {
        method: 'PUT'
      });
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [userEmail]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approved':
        return <FaCheck className="text-green-400" />;
      case 'rejected':
        return <FaTimes className="text-red-400" />;
      default:
        return <FaBell className="text-blue-400" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg bg-[#1F2937] border border-[#374151] hover:border-[#3B82F6] transition-all"
      >
        <FaBell className="text-xl text-[#9CA3AF] hover:text-[#3B82F6] transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-[#1F2937] border border-[#374151] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[#374151] bg-[#111827]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs text-[#3B82F6] hover:text-[#60A5FA] transition flex items-center gap-1 disabled:opacity-50"
                >
                  <FaCheckDouble /> Mark all read
                </button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-xs text-[#9CA3AF] mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FaBell className="text-4xl text-[#374151] mx-auto mb-3" />
                <p className="text-[#9CA3AF] text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-[#374151] hover:bg-[#374151]/30 transition cursor-pointer ${
                    !notification.isRead ? 'bg-[#3B82F6]/10' : ''
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'text-white font-semibold' : 'text-[#9CA3AF]'}`}>
                        {notification.message}
                      </p>
                      {notification.bookingDetails && (
                        <div className="mt-2 text-xs text-[#9CA3AF] space-y-1">
                          <div>📍 Room: {notification.bookingDetails.room}</div>
                          <div>📅 Date: {notification.bookingDetails.date}</div>
                          <div>🕐 Time: {notification.bookingDetails.slot}</div>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-[#6B7280]">{formatTime(notification.createdAt)}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#374151] bg-[#111827] text-center">
              <button
                onClick={() => setShowDropdown(false)}
                className="text-xs text-[#3B82F6] hover:text-[#60A5FA] transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
