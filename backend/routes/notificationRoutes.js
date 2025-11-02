const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get all notifications for a user
router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // Last 50 notifications
    
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// Get unread count
router.get('/notifications/:userId/unread-count', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.countDocuments({ userId, isRead: false });
    
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching unread count', error: err.message });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification as read', error: err.message });
  }
});

// Mark all notifications as read for a user
router.put('/notifications/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking all as read', error: err.message });
  }
});

// Create a notification (internal use)
router.post('/notifications', async (req, res) => {
  try {
    const { userId, message, type, bookingDetails } = req.body;
    
    const notification = new Notification({
      userId,
      message,
      type,
      bookingDetails
    });
    
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error creating notification', error: err.message });
  }
});

// Delete a notification
router.delete('/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
});

module.exports = router;
